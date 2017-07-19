import { deserializeAttributes, serializeAttributes } from './http';

describe('http module', () => {
  describe('#handleErrors', () => {
    // What scenarios do we handle?
  });


  describe('#serializeAttributes', () => {
    describe('when translatable contains an attribute object', () => {
      const xlatable = { attributes: { First: [1], Second: [2] } }
      const result = serializeAttributes(xlatable, 'attributes');

      test('returns an array', () => {
        expect(result.attributes).toBeInstanceOf(Array);
        expect(result.attributes).toHaveLength(2);
      });

      test('returned array contains objects', () => {
        expect(result.attributes[0]).toBeDefined();
        expect(result.attributes[0]).toHaveProperty('name', 'First');
        expect(result.attributes[0]).toHaveProperty('values', [1]);
      });

      test('mutates the object passed', () => {
        expect(xlatable.attributes).toBeDefined();
        expect(xlatable.attributes).toBeInstanceOf(Array);
      });
    });

    describe('when translatable contains an attribute array', () => {
      const xlatable = {
        attributes: [
          { name: 'First', values: [1] },
          { name: 'Second', values: [2] },
        ],
      };
      const result = serializeAttributes(xlatable, 'attributes');

      test('returns an array', () => {
        expect(result.attributes).toBeInstanceOf(Array);
        expect(result.attributes).toHaveLength(2);
      });

      test('returned array contains objects', () => {
        expect(result.attributes[0]).toBeDefined();
        expect(result.attributes[0]).toHaveProperty('name', 'First');
        expect(result.attributes[0]).toHaveProperty('values', [1]);
      });
    });

    test('when attribute key does not exist', () => {
      const src = { thing: {} };

      const dest = serializeAttributes(src, 'attributes');
      expect(src).toEqual(src);
    });
  });

  describe('#deserializeAttributes', () => {
    //  - when the envelop is an array.
    // when the attribute key is not present
    test('when there is no envelop', () => {
      const src = {
        attributes: [
          { name: 'A', values: ['B'] },
        ],
      };
      const dest = deserializeAttributes('attributes')(src);

      expect(dest).toBeDefined();
      expect(dest.attributes).toBeInstanceOf(Object);
    });

    test('when there is an envelop', () => {
      const src = {
        thing: {
          attributes: [
            { name: 'A', values: ['B'] },
          ],
        },
      };
      const dest = deserializeAttributes('attributes', 'thing')(src);

      expect(dest).toBeDefined();
      expect(dest.thing.attributes).toBeInstanceOf(Object);
    });

    test('when the envelop contains an array', () => {
      const src = {
        thing: [
          {
            name: 'Thing',
            slug: 'thing',
            attributes: [
              { name: 'A', values: ['B'] },
            ],
          },
        ],
      };

      const dest = deserializeAttributes('attributes', 'thing')(src);

      expect(dest).toBeDefined();
      expect(dest.thing[0].attributes).toBeInstanceOf(Object);
    });

    test('when attribute key does not exist', () => {
      const src = { thing: {} };

      const dest = deserializeAttributes('attributes', 'thing')(src);
      expect(src).toEqual(src);
    });
  });
});
