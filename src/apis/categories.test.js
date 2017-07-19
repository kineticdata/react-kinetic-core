import axios from 'axios';

import { fetchCategory, fetchCategories } from './categories';
import { CategoryBuilder } from '../test_utils/category_builder';
import { rejectPromiseWith, resolvePromiseWith } from '../test_utils/promises';
import { fetchDocMarkdown } from '../test_utils/docs';

// Mock out the bundle object from a dependency.
jest.mock('../core-helpers', () => ({
  bundle: {
    apiLocation: () => 'category/app/api/v1',
    kappSlug: () => 'mock-kapp',
  },
}));

describe('categories api', () => {
  test('documentation', () => {
    const methods = [
      'fetchCategories', 'fetchCategory',
    ];

    expect.assertions(methods.length);
    return fetchDocMarkdown('API.md').then((result) => {
      methods.forEach((method) => {
        const matches = result.filter(line => line.endsWith(method));
        expect(matches).toHaveLength(1);
      });
    });
  });
  describe('#fetchCategories', () => {
    describe('when successful', () => {
      let response;
      let testCategory;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            categories: [],
          },
        };
        testCategory = new CategoryBuilder().stub().withAttribute('Attribute', 'value').build();
        response.data.categories.push(testCategory);
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchCategories().then(({ errors }) => {
          expect(errors).toBeUndefined();
        });
      });

      test('returns an array of categories', () => {
        expect.assertions(2);
        return fetchCategories().then(({ categories }) => {
          expect(categories).toBeInstanceOf(Array);
          expect(categories[0]).toMatchObject({
            name: testCategory.name,
            slug: testCategory.slug,
          });
        });
      });

      test('translates attributes', () => {
        expect.assertions(2);
        return fetchCategories().then(({ categories }) => {
          expect(categories[0].attributes).toBeDefined();
          expect(categories[0].attributes).not.toBeInstanceOf(Array);
        });
      });
    });
  });

  describe('#fetchCategory', () => {
    describe('when successful', () => {
      let response;
      let testCategory;
      let categorySlug;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            category: {},
          },
        };
        testCategory = new CategoryBuilder().stub().withAttribute('Attribute', 'value').build();
        categorySlug = testCategory.slug;
        response.data.category = testCategory;
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchCategory({ categorySlug }).then(({ errors }) => {
          expect(errors).toBeUndefined();
        });
      });

      test('returns a category', () => {
        expect.assertions(1);
        return fetchCategory({ categorySlug }).then(({ category }) => {
          expect(category).toMatchObject({
            name: testCategory.name,
            slug: testCategory.slug,
          });
        });
      });

      test('translates attributes', () => {
        expect.assertions(2);
        return fetchCategory({ categorySlug }).then(({ category }) => {
          expect(category.attributes).toBeDefined();
          expect(category.attributes).not.toBeInstanceOf(Array);
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

      test('throws an exception when no category slug is provided', () => {
        expect(() => { fetchCategory({}); }).toThrow();
      });

      test('does return errors', () => {
        expect.assertions(1);
        return fetchCategory({ categorySlug: 'fake' }).then(({ serverError }) => {
          expect(serverError).toBeDefined();
        });
      });
    });
  });
});
