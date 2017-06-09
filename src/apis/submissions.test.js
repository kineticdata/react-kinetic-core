import { SubmissionSearch } from './submissions';

describe('SubmissionSearch', () => {
  let search;

  beforeEach(() => {
    search = new SubmissionSearch();
  });

  test('empty searchers have no query', () => {
    expect(search.build().query).toEqual('');
  });

  test('eq adds an equality comparison', () => {
    expect(
      search
        .eq('attr', 'val')
        .build().query,
    ).toEqual('attr = "val"');
  });

  test('eq assumes null for empty rvalue', () => {
    expect(
      search
        .eq('attr', '')
        .build().query,
    ).toEqual('attr = null');
  });

  test('multiple eq implies an and', () => {
    expect(
      search
        .eq('val1', '1')
        .eq('val2', '2')
        .build().query,
    ).toEqual('val1 = "1" AND val2 = "2"');
  });

  test('in generates an in-list', () => {
    expect(
      search
        .in('attr', ['val1', 'val2'])
        .build().query,
    ).toEqual('attr IN ("val1", "val2")');
  });

  describe('groupings', () => {
    test('or separates equalities in its context with OR', () => {
      expect(
        search
          .or()
            .eq('a', '1')
            .eq('b', '2')
          .end()
          .build().query,
      ).toEqual('( a = "1" OR b = "2")');
    });

    test('or following other equalities implies an and', () => {
      expect(
        search
          .eq('out', 'outer')
          .or()
            .eq('a', '1')
            .eq('b', '2')
          .end()
          .build().query,
      ).toEqual('out = "outer" AND ( a = "1" OR b = "2")');
    });

    test('complex query', () => {
      expect(
        search
          .eq('always', 'needed')
          .or()
            .eq('a', 'toBeA')
            .and()
              .eq('b', 'toBeB')
              .eq('c', 'toBeC')
            .end()
          .end()
          .build().query,
      ).toEqual('always = "needed" AND ( a = "toBeA" OR ( b = "toBeB" AND c = "toBeC"))');
    });
  });

  describe('search metadata', () => {
    test('sets the type', () => {
      expect(search.type('foo').build().type).toBe('foo');
    });

    describe('#coreState', () => {
      test('sets coreState', () => {
        expect(search.coreState('Closed').build().coreState).toBe('Closed');
      });

      test('setting an invalid coreState throws an error', () => {
        expect(() => {
          search.coreState('InvalidCoreState');
        }).toThrow();
      });
    });

    describe('#startDate', () => {
      test('throws an error if it is not a valid date', () => {
        expect(() => {
          search.startDate(1);
        }).toThrow();
      });

      test('sets the date as an ISO string', () => {
        expect(
          search
            .startDate(new Date())
            .build()
            .start,
        ).toEqual(
          expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
        );
      });

      test('throws an error if used inside a query scope', () => {
        expect(() => {
          search.or().startDate(new Date());
        }).toThrow();
      });
    });

    describe('#endDate', () => {
      test('throws an error if it is not a valid date', () => {
        expect(() => {
          search.endDate(1);
        }).toThrow();
      });

      test('sets the date as an ISO string', () => {
        expect(
          search
            .startDate(new Date())
            .build()
            .start,
        ).toEqual(
          expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
        );
      });

      test('throws an error if used inside a query scope', () => {
        expect(() => {
          search.or().endDate(new Date());
        }).toThrow();
      });
    });

    describe('build-time validations', () => {
      test('defaults end date to now if start is set and end is omitted', () => {

      });
      test('validates start date is before end', () => {
      });
    });
  });
});
