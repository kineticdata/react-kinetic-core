import { path, queryString } from './CoreForm';

jest.mock('../core-helpers', () => ({
  bundle: {
    spaceLocation: () => '/kinetic/acme',
    kappSlug: () => 'catalog',
  },
}));

describe('path', () => {
  test('builds url with default kapp', () => {
    expect(
      path({ form: 'ipad-request' }),
    ).toBe(
      '/kinetic/acme/catalog/ipad-request',
    );
  });

  test('builds url with specified kapp', () => {
    expect(
      path({ form: 'ipad-request', kapp: 'services' }),
    ).toBe(
      '/kinetic/acme/services/ipad-request',
    );
  });

  test('builds url with the submission id', () => {
    expect(
      path({ submission: 'abc123' }),
    ).toBe(
      '/kinetic/acme/submissions/abc123',
    );
  });
});

describe('queryString', () => {
  test('review passed true should not have a parameter value', () => {
    expect(
      queryString({ review: true }),
    ).toBe(
      'review',
    );
  });

  test('review passed a string should have a parameter value', () => {
    expect(
      queryString({ review: 'Page One' }),
    ).toBe(
      'review=Page%20One',
    );
  });

  test('review passed anything else should be omitted', () => {
    expect(
      queryString({ review: false }),
    ).toBe(
      '',
    );
  });

  test('values should be wrapped with values[] and encoded', () => {
    expect(
      queryString({ values: { 'First Name': 'Shayne', 'Last Name': 'Koestler' } }),
    ).toBe(
      'values%5BFirst%20Name%5D=Shayne&values%5BLast%20Name%5D=Koestler',
    );
  });

  test('values should be omitted when empty or non-object', () => {
    expect(
      queryString({ values: {} }),
    ).toBe(
      '',
    );

    expect(
      queryString({ values: 'asdf' }),
    ).toBe(
      '',
    );
  });

  test('combines review and values', () => {
    expect(
      queryString({ review: true, values: { 'Full Name': 'Don Demo' } }),
    ).toMatch(
      'review',
    );
    expect(
      queryString({ review: true, values: { 'Full Name': 'Don Demo' } }),
    ).toMatch(
      'values%5BFull%20Name%5D=Don%20Demo',
    );
  });
});
