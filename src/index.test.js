import {
  CoreAPI,
} from './index';

// Mock out the bundle object from a dependency.
jest.mock('./core-helpers', () => ({
  bundle: {
    apiLocation: () => 'user/app/api/v1',
    kappSlug: () => 'mock-kapp',
  },
}));

describe('react-kinetic-core module', () => {
  describe('CoreAPI', () => {
    test('API functions are exposed', () => {
      expect(CoreAPI.fetchCategory).toBeDefined();
      expect(CoreAPI.fetchForms).toBeDefined();
      expect(CoreAPI.fetchKapps).toBeDefined();
      expect(CoreAPI.fetchSpace).toBeDefined();
      expect(CoreAPI.fetchSubmission).toBeDefined();
      expect(CoreAPI.fetchTeams).toBeDefined();
      expect(CoreAPI.fetchProfile).toBeDefined();
      expect(CoreAPI.fetchUsers).toBeDefined();
      expect(CoreAPI.fetchBridgedResource).toBeDefined();
    });
  });
});
