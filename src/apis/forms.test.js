import axios from 'axios';

import { fetchForm, fetchForms } from './forms';
import { FormBuilder } from '../test_utils/form_builder';
import { rejectPromiseWith, resolvePromiseWith } from '../test_utils/promises';


// Mock out the bundle object from a dependency.
jest.mock('../core-helpers', () => ({
  bundle: {
    apiLocation: () => 'form/app/api/v1',
    kappSlug: () => 'mock-kapp',
  },
}));

describe('forms api', () => {
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
        testForm = new FormBuilder().stub().withAttribute('Attribute', 'value').build();
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

      test('does not translate attributes by default', () => {
        expect.assertions(2);
        return fetchForms().then(({ forms }) => {
          expect(forms[0].attributes).toBeDefined();
          expect(forms[0].attributes).toBeInstanceOf(Array);
        });
      });

      test('.xlatAttributes translates attributes', () => {
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
        testForm = new FormBuilder().stub().withAttribute('Attribute', 'value').build();
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

      test('does not translate attributes by default', () => {
        expect.assertions(2);
        return fetchForm({ formSlug }).then(({ form }) => {
          expect(form.attributes).toBeDefined();
          expect(form.attributes).toBeInstanceOf(Array);
        });
      });

      test('.xlatAttributes translates attributes', () => {
        expect.assertions(2);
        return fetchForm({ formSlug, xlatAttributes: true }).then(({ form }) => {
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
        expect(() => { fetchForm({}); }).toThrow();
      });

      test('does return errors', () => {
        expect.assertions(1);
        return fetchForm({ formSlug: 'fake', xlatAttributes: true }).then(({ serverError }) => {
          expect(serverError).toBeDefined();
        });
      });
    });
  });
});
