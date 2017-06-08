import axios from 'axios';
import { bundle } from '../core-helpers';
import { attributeTranslator, handleErrors, paramBuilder } from './http';

export const fetchTeams = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/teams`, {
    params: { ...paramBuilder(options), archived: options.archived },
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ teams: response.data.teams }));

  // Translate attributes if requested.
  if (options.xlatAttributes) {
    promise = promise.then(attributeTranslator('attributes', 'teams'));
  }

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const fetchTeam = (options = {}) => {
  const {
    teamSlug,
  } = options;

  if (!teamSlug) {
    throw new Error('fetchTeam failed! The option "teamSlug" is required.');
  }

  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/teams/${teamSlug}`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ team: response.data.team }));

  // Translate attributes if requested.
  if (options.xlatAttributes) {
    promise = promise.then(attributeTranslator('attributes', 'team'));
  }

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
