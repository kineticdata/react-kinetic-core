import axios from 'axios';
import { bundle } from '../core-helpers';
import { attributeTranslator, handleErrors, paramBuilder } from './http';

const PROFILE_ENDPOINT = `${bundle.apiLocation()}/me`;

// Extract the profile from the data and return it.
// If there are any errors clean them up and return them instead.
export const fetchProfile = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.get(PROFILE_ENDPOINT, {
    params: paramBuilder(options),
  });

  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ profile: response.data }));

  // Translate attributes if requested.
  if (options.xlatAttributes) {
    promise = promise.then(attributeTranslator('userAttributes', 'profile'));
    promise = promise.then(attributeTranslator('profileAttributes', 'profile'));
  }

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const putProfile = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.put(PROFILE_ENDPOINT, {
    params: paramBuilder(options),
  });

  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ profile: response.data.user }));

  // Translate attributes if requested.
  if (options.xlatAttributes) {
    promise = promise.then(attributeTranslator('userAttributes', 'profile'));
    promise = promise.then(attributeTranslator('profileAttributes', 'profile'));
  }

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
