import axios from 'axios';
import createError from 'axios/lib/core/createError';
import { fetchForm, fetchForms, updateForm } from './forms';
import { FormBuilder } from '../test_utils/form_builder';
import { rejectPromiseWith, resolvePromiseWith } from '../test_utils/promises';
import { fetchDocMarkdown } from '../test_utils/docs';

jest.mock('axios');

// Mock out the bundle object from a dependency.
jest.mock('../core-helpers', () => ({
  bundle: {
    apiLocation: () => 'form/app/api/v1',
    spaceLocation: () => '/kinetic/acme',
    kappSlug: () => 'mock-kapp',
  },
}));

describe('forms api', () => {
  test('documentation', () => {
    const methods = ['fetchForms', 'fetchForm'];

    expect.assertions(methods.length);
    return fetchDocMarkdown('API.md').then(result => {
      methods.forEach(method => {
        const matches = result.filter(line => line.endsWith(method));
        expect(matches).toHaveLength(1);
      });
    });
  });
  describe('#fetchForms', () => {
    describe('when successful', () => {
      let response;
      let testForm;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            forms: [],
          },
        };
        testForm = new FormBuilder()
          .stub()
          .withAttribute('Attribute', 'value')
          .build();
        response.data.forms.push(testForm);
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchForms().then(({ errors }) => {
          expect(errors).toBeUndefined();
        });
      });

      test('returns an array of forms', () => {
        expect.assertions(2);
        return fetchForms().then(({ forms }) => {
          expect(forms).toBeInstanceOf(Array);
          expect(forms[0]).toMatchObject({
            name: testForm.name,
            slug: testForm.slug,
          });
        });
      });

      test('translates attributes', () => {
        expect.assertions(2);
        return fetchForms({ xlatAttributes: true }).then(({ forms }) => {
          expect(forms[0].attributes).toBeDefined();
          expect(forms[0].attributes).not.toBeInstanceOf(Array);
        });
      });
    });
  });

  describe('#fetchForm', () => {
    describe('when successful', () => {
      let response;
      let testForm;
      let formSlug;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            form: {},
          },
        };
        testForm = new FormBuilder()
          .stub()
          .withAttribute('Attribute', 'value')
          .build();
        formSlug = testForm.slug;
        response.data.form = testForm;
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchForm({ formSlug }).then(({ errors }) => {
          expect(errors).toBeUndefined();
        });
      });

      test('returns a form', () => {
        expect.assertions(1);
        return fetchForm({ formSlug }).then(({ form }) => {
          expect(form).toMatchObject({
            name: testForm.name,
            slug: testForm.slug,
          });
        });
      });

      test('translates attributes', () => {
        expect.assertions(2);
        return fetchForm({ formSlug }).then(({ form }) => {
          expect(form.attributes).toBeDefined();
          expect(form.attributes).not.toBeInstanceOf(Array);
        });
      });
    });

    describe('when unsuccessful', () => {
      let response;

      beforeEach(() => {
        response = {
          status: 500,
        };
        axios.get = rejectPromiseWith({ response });
      });

      test('throws an exception when no form slug is provided', () => {
        expect(() => {
          fetchForm({});
        }).toThrow();
      });

      test('does return errors', () => {
        expect.assertions(1);
        return fetchForm({ formSlug: 'fake', xlatAttributes: true }).then(
          ({ serverError }) => {
            expect(serverError).toBeDefined();
          },
        );
      });
    });
  });

  describe('updateForm', () => {
    beforeEach(() => {
      axios.put.mockReset();
    });

    test('success', async () => {
      axios.put.mockResolvedValue({
        status: 200,
        data: {
          form: {
            name: 'Test Form',
            attributes: [{ name: 'Icon', values: ['fa-gear'] }],
          },
        },
      });
      const { form, error, errors, serverError } = await updateForm({
        kappSlug: 'catalog',
        formSlug: 'test-form',
        form: { name: 'Test Form', attributes: { Icon: ['fa-gear'] } },
        include: 'attributes,pages',
      });
      expect(axios.put.mock.calls).toEqual([
        [
          'form/app/api/v1/kapps/catalog/forms/test-form',
          {
            name: 'Test Form',
            attributes: [{ name: 'Icon', values: ['fa-gear'] }],
          },
          { params: { include: 'attributes,pages' } },
        ],
      ]);
      expect(form).toEqual({
        name: 'Test Form',
        attributes: { Icon: ['fa-gear'] },
      });
      expect(error).toBeUndefined();
      expect(errors).toBeUndefined();
      expect(serverError).toBeUndefined();
    });

    test('datastore form', async () => {
      axios.put.mockResolvedValue({
        status: 200,
        data: {
          form: {
            name: 'Test Datastore Form',
            attributes: [{ name: 'Icon', values: ['fa-gear'] }],
          },
        },
      });
      const { form, error, errors, serverError } = await updateForm({
        formSlug: 'test-form',
        datastore: true,
        form: {
          name: 'Test Datastore Form',
          attributes: { Icon: ['fa-gear'] },
        },
        include: 'attributes,pages',
      });
      expect(axios.put.mock.calls).toEqual([
        [
          'form/app/api/v1/datastore/forms/test-form',
          {
            name: 'Test Datastore Form',
            attributes: [{ name: 'Icon', values: ['fa-gear'] }],
          },
          { params: { include: 'attributes,pages' } },
        ],
      ]);
      expect(form).toEqual({
        name: 'Test Datastore Form',
        attributes: { Icon: ['fa-gear'] },
      });
      expect(error).toBeUndefined();
      expect(errors).toBeUndefined();
      expect(serverError).toBeUndefined();
    });

    test('defaults to bundle.kappSlug() when no kappSlug provided', async () => {
      axios.put.mockResolvedValue({ status: 200, data: {} });
      await updateForm({ form: { name: 'Test' }, formSlug: 'test' });
      expect(axios.put.mock.calls).toEqual([
        [
          'form/app/api/v1/kapps/mock-kapp/forms/test',
          { name: 'Test' },
          { params: {} },
        ],
      ]);
    });

    test('missing form', () => {
      expect(() => {
        updateForm({ formSlug: 'test' });
      }).toThrow('updateForm failed! The option "form" is required.');
    });

    test('missing kappSlug', () => {
      // Note that we need to set it to null becuse by default if kappSlug is
      // not passed (undefined) it checks the 'bundle' helper.
      expect(() => {
        updateForm({ formSlug: 'test', form: {}, kappSlug: null });
      }).toThrow('updateForm failed! The option "kappSlug" is required.');
    });

    test('missing kappSlug allowed when datastore is true', () => {
      axios.put.mockResolvedValue({ status: 200, data: {} });
      expect(() => {
        updateForm({
          formSlug: 'test',
          form: {},
          kappSlug: null,
          datastore: true,
        });
      }).not.toThrowError();
    });

    test('missing formSlug', () => {
      expect(() => {
        updateForm({ form: {} });
      }).toThrow('updateForm failed! The option "formSlug" is required.');
    });

    test('bad request', async () => {
      axios.put.mockRejectedValue(
        createError('Request failed with status code 400', null, 400, null, {
          status: 400,
          statusText: 'Bad Request',
          data: { error: 'Invalid form' },
        }),
      );
      const { form, error, errors, serverError } = await updateForm({
        formSlug: 'test',
        form: { name: null },
      });
      expect(form).toBeUndefined();
      expect(error).toBe('Invalid form');
      expect(errors).toBeUndefined();
      expect(serverError).toBeUndefined();
    });

    test('serverError', async () => {
      axios.put.mockRejectedValue(
        createError('Request failed with status code 403', null, 403, null, {
          status: 403,
          statusText: 'Forbidden',
        }),
      );
      const { form, error, errors, serverError } = await updateForm({
        formSlug: 'test',
        form: { name: 'Test' },
      });
      expect(form).toBeUndefined();
      expect(error).toBeUndefined();
      expect(errors).toBeUndefined();
      expect(serverError).toEqual({ status: 403, statusText: 'Forbidden' });
    });
  });
});
