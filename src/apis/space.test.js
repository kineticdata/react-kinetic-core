import axios from 'axios';
import createError from 'axios/lib/core/createError';
import { fetchSpace, updateSpace } from './space';
import { SpaceBuilder } from '../test_utils/space_builder';
import { rejectPromiseWith, resolvePromiseWith } from '../test_utils/promises';
import { fetchDocMarkdown } from '../test_utils/docs';

jest.mock('axios');

// Mock out the bundle object from a dependency.
jest.mock('../core-helpers', () => ({
  bundle: {
    apiLocation: () => 'space/app/api/v1',
  },
}));

describe('space api', () => {
  test('documentation', () => {
    const methods = ['fetchSpace'];

    expect.assertions(methods.length);
    return fetchDocMarkdown('API.md').then(result => {
      methods.forEach(method => {
        const matches = result.filter(line => line.endsWith(method));
        expect(matches).toHaveLength(1);
      });
    });
  });
  describe('#fetchSpace', () => {
    describe('when successful', () => {
      let response;
      let testSpace;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            space: {},
          },
        };
        testSpace = new SpaceBuilder()
          .stub()
          .withAttribute('Attribute', 'value')
          .build();
        response.data.space = testSpace;
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchSpace().then(({ serverError }) => {
          expect(serverError).toBeUndefined();
        });
      });

      test('returns a space', () => {
        expect.assertions(1);
        return fetchSpace().then(({ space }) => {
          expect(space).toMatchObject({
            name: testSpace.name,
            slug: testSpace.slug,
          });
        });
      });

      test('translates attributes', () => {
        expect.assertions(2);
        return fetchSpace({ xlatAttributes: true }).then(({ space }) => {
          expect(space.attributes).toBeDefined();
          expect(space.attributes).not.toBeInstanceOf(Array);
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

      test('does return errors', () => {
        expect.assertions(1);
        return fetchSpace({
          includes: 'attributes',
          xlatAttributes: true,
        }).then(({ serverError }) => {
          expect(serverError).toBeDefined();
        });
      });
    });
  });

  describe('updateSpace', () => {
    beforeEach(() => {
      axios.put.mockReset();
    });

    test('success', async () => {
      axios.put.mockResolvedValue({
        status: 200,
        data: {
          space: {
            name: 'Foo',
            attributes: [{ name: 'Company Name', values: ['Foo Bar'] }],
          },
        },
      });
      const { space, error, errors, serverError } = await updateSpace({
        space: { name: 'Foo', attributes: { 'Company Name': ['Foo Bar'] } },
        include: 'attributes',
      });
      expect(axios.put.mock.calls).toEqual([
        [
          'space/app/api/v1/space',
          {
            name: 'Foo',
            attributes: [{ name: 'Company Name', values: ['Foo Bar'] }],
          },
          { params: { include: 'attributes' } },
        ],
      ]);
      expect(space).toEqual({
        name: 'Foo',
        attributes: { 'Company Name': ['Foo Bar'] },
      });
      expect(error).toBeUndefined();
      expect(errors).toBeUndefined();
      expect(serverError).toBeUndefined();
    });

    test('missing space', async () => {
      expect(() => {
        updateSpace({});
      }).toThrow('updateSpace failed! The option "space" is required.');
    });

    test('bad request', async () => {
      axios.put.mockRejectedValue(
        createError('Request failed with status code 400', null, 400, null, {
          status: 400,
          statusText: 'Bad Request',
          data: { error: 'Invalid space' },
        }),
      );
      const { space, error, errors, serverError } = await updateSpace({
        space: { name: null },
      });
      expect(space).toBeUndefined();
      expect(error).toBe('Invalid space');
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
      const { space, error, errors, serverError } = await updateSpace({
        space: { name: 'Foo' },
      });
      expect(space).toBeUndefined();
      expect(error).toBeUndefined();
      expect(errors).toBeUndefined();
      expect(serverError).toEqual({ status: 403, statusText: 'Forbidden' });
    });
  });
});
