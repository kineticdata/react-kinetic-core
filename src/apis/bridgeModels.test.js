import axios from 'axios';
import createError from 'axios/lib/core/createError';
import { fetchBridgeModels, fetchBridgeModel } from './bridgeModels';

jest.mock('axios');

// Mock out the bundle object from a dependency.
jest.mock('../core-helpers', () => ({
  bundle: {
    apiLocation: () => 'space/app/api/v1',
  },
}));

describe('bridgeModels api', () => {
  describe('fetchBridgeModels', () => {
    beforeEach(() => {
      axios.get.mockReset();
    });

    test('success', async () => {
      axios.get.mockResolvedValue({
        status: 200,
        data: {
          models: [{ name: 'Person' }, { name: 'Building' }],
        },
      });
      const result = await fetchBridgeModels({ include: 'attributes' });
      expect(axios.get.mock.calls).toEqual([
        ['space/app/api/v1/models', { params: { include: 'attributes' } }],
      ]);
      expect(result).toEqual({
        bridgeModels: [{ name: 'Person' }, { name: 'Building' }],
      });
    });

    test('forbidden', async () => {
      axios.get.mockRejectedValue(
        createError('Request failed with status code 403', null, 403, null, {
          status: 403,
          statusText: 'Forbidden',
        }),
      );
      const result = await fetchBridgeModels({ include: 'attributes' });
      expect(axios.get.mock.calls).toEqual([
        ['space/app/api/v1/models', { params: { include: 'attributes' } }],
      ]);
      expect(result).toEqual({
        serverError: { status: 403, statusText: 'Forbidden' },
      });
    });
  });

  describe('fetchBridgeModel', () => {
    beforeEach(() => {
      axios.get.mockReset();
    });

    test('success', async () => {
      axios.get.mockResolvedValue({
        status: 200,
        data: {
          model: { name: 'Person' },
        },
      });
      const result = await fetchBridgeModel({
        modelName: 'Person',
        include: 'attributes',
      });
      expect(axios.get.mock.calls).toEqual([
        [
          'space/app/api/v1/models/Person',
          { params: { include: 'attributes' } },
        ],
      ]);
      expect(result).toEqual({
        bridgeModel: { name: 'Person' },
      });
    });

    test('missing modelName', () => {
      expect(() => {
        fetchBridgeModel({ include: 'attributes' });
      }).toThrowError(
        'fetchBridgeModel failed! The following required options are missing: modelName',
      );
    });

    test('forbidden', async () => {
      axios.get.mockRejectedValue(
        createError('Request failed with status code 403', null, 403, null, {
          status: 403,
          statusText: 'Forbidden',
        }),
      );
      const result = await fetchBridgeModel({
        modelName: 'Person',
        include: 'attributes',
      });
      expect(axios.get.mock.calls).toEqual([
        [
          'space/app/api/v1/models/Person',
          { params: { include: 'attributes' } },
        ],
      ]);
      expect(result).toEqual({
        serverError: { status: 403, statusText: 'Forbidden' },
      });
    });
  });

  describe('createBridgeModel', () => {});
  describe('updateBridgeModel', () => {});
});
