import { attributeTranslator } from './http';

describe('http module', () => {
  describe('#handleErrors', () => {
    // What scenarios do we handle?
  });

  describe('#attributeTranslator', () => {
    //  - when the envelop is an array.
    // when the attribute key is not present
    test('when there is no envelop', () => {
      const src = {
        attributes: [
          { name: 'A', values: ['B'] },
        ],
      };
      const dest = attributeTranslator('attributes')(src);

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
      const dest = attributeTranslator('attributes', 'thing')(src);

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

      const dest = attributeTranslator('attributes', 'thing')(src);

      expect(dest).toBeDefined();
      expect(dest.thing[0].attributes).toBeInstanceOf(Object);
    });
  });
});
