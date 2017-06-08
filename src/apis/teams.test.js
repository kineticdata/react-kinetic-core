import axios from 'axios';

import { fetchTeam, fetchTeams } from './teams';
import { TeamBuilder } from '../test_utils/team_builder';
import { rejectPromiseWith, resolvePromiseWith } from '../test_utils/promises';


// Mock out the bundle object from a dependency.
jest.mock('../core-helpers', () => ({
  bundle: {
    apiLocation: () => 'team/app/api/v1',
    kappSlug: () => 'mock-kapp',
  },
}));

describe('teams api', () => {
  describe('#fetchTeams', () => {
    describe('when successful', () => {
      let response;
      let testTeam;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            teams: [],
          },
        };
        testTeam = new TeamBuilder().stub().withAttribute('Attribute', 'value').build();
        response.data.teams.push(testTeam);
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchTeams().then(({ errors }) => {
          expect(errors).toBeUndefined();
        });
      });

      test('returns an array of teams', () => {
        expect.assertions(2);
        return fetchTeams().then(({ teams }) => {
          expect(teams).toBeInstanceOf(Array);
          expect(teams[0]).toMatchObject({
            name: testTeam.name,
            slug: testTeam.slug,
          });
        });
      });

      test('does not translate attributes by default', () => {
        expect.assertions(2);
        return fetchTeams().then(({ teams }) => {
          expect(teams[0].attributes).toBeDefined();
          expect(teams[0].attributes).toBeInstanceOf(Array);
        });
      });

      test('.xlatAttributes translates attributes', () => {
        expect.assertions(2);
        return fetchTeams({ xlatAttributes: true }).then(({ teams }) => {
          expect(teams[0].attributes).toBeDefined();
          expect(teams[0].attributes).not.toBeInstanceOf(Array);
        });
      });
    });
  });

  describe('#fetchTeam', () => {
    describe('when successful', () => {
      let response;
      let testTeam;
      let teamSlug;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            team: {},
          },
        };
        testTeam = new TeamBuilder().stub().withAttribute('Attribute', 'value').build();
        teamSlug = testTeam.slug;
        response.data.team = testTeam;
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchTeam({ teamSlug }).then(({ errors }) => {
          expect(errors).toBeUndefined();
        });
      });

      test('returns a team', () => {
        expect.assertions(1);
        return fetchTeam({ teamSlug }).then(({ team }) => {
          expect(team).toMatchObject({
            name: testTeam.name,
            slug: testTeam.slug,
          });
        });
      });

      test('does not translate attributes by default', () => {
        expect.assertions(2);
        return fetchTeam({ teamSlug }).then(({ team }) => {
          expect(team.attributes).toBeDefined();
          expect(team.attributes).toBeInstanceOf(Array);
        });
      });

      test('.xlatAttributes translates attributes', () => {
        expect.assertions(2);
        return fetchTeam({ teamSlug, xlatAttributes: true }).then(({ team }) => {
          expect(team.attributes).toBeDefined();
          expect(team.attributes).not.toBeInstanceOf(Array);
        });
      });
    });

    describe('when unsuccessful', () => {
      let response;

      beforeEach(() => {
        response = {
          status: 500,
        };
        axios.get = rejectPromiseWith(response);
      });

      test('throws an exception when no team slug is provided', () => {
        expect(() => { fetchTeam({}); }).toThrow();
      });

      test('does return errors', () => {
        expect.assertions(1);
        return fetchTeam({ teamSlug: 'fake', xlatAttributes: true }).then(({ errors }) => {
          expect(errors).toBeDefined();
        });
      });
    });
  });
});
