import axios from 'axios';

import { fetchKapp, fetchKapps } from './kapps';
import { KappBuilder } from '../test_utils/kapp_builder';
import { rejectPromiseWith, resolvePromiseWith } from '../test_utils/promises';


// Mock out the bundle object from a dependency.
jest.mock('../core-helpers', () => ({
  bundle: {
    apiLocation: () => 'kapp/app/api/v1',
    kappSlug: () => 'mock-kapp',
  },
}));

describe('kapps api', () => {
  describe('#fetchKapps', () => {
    describe('when successful', () => {
      let response;
      let testKapp;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            kapps: [],
          },
        };
        testKapp = new KappBuilder().stub().withAttribute('Attribute', 'value').build();
        response.data.kapps.push(testKapp);
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchKapps().then(({ serverError }) => {
          expect(serverError).toBeUndefined();
        });
      });

      test('returns an array of kapps', () => {
        expect.assertions(2);
        return fetchKapps().then(({ kapps }) => {
          expect(kapps).toBeInstanceOf(Array);
          expect(kapps[0]).toMatchObject({
            name: testKapp.name,
            slug: testKapp.slug,
          });
        });
      });

      test('translates attributes', () => {
        expect.assertions(2);
        return fetchKapps({ xlatAttributes: true }).then(({ kapps }) => {
          expect(kapps[0].attributes).toBeDefined();
          expect(kapps[0].attributes).not.toBeInstanceOf(Array);
        });
      });
    });
  });

  describe('#fetchKapp', () => {
    describe('when successful', () => {
      let response;
      let testKapp;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            kapp: {},
          },
        };
        testKapp = new KappBuilder().stub().withAttribute('Attribute', 'value').build();
        response.data.kapp = testKapp;
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchKapp().then(({ errors }) => {
          expect(errors).toBeUndefined();
        });
      });

      test('returns a kapp', () => {
        expect.assertions(1);
        return fetchKapp().then(({ kapp }) => {
          expect(kapp).toMatchObject({
            name: testKapp.name,
            slug: testKapp.slug,
          });
        });
      });

      test('translates attributes', () => {
        expect.assertions(2);
        return fetchKapp({ xlatAttributes: true }).then(({ kapp }) => {
          expect(kapp.attributes).toBeDefined();
          expect(kapp.attributes).not.toBeInstanceOf(Array);
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
        return fetchKapp({ includes: 'attributes', xlatAttributes: true }).then(({ serverError }) => {
          expect(serverError).toBeDefined();
        });
      });
    });
  });
});
