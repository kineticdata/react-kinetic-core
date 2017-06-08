import axios from 'axios';
import { bundle } from '../core-helpers';
import { attributeTranslator, handleErrors, paramBuilder } from './http';

export const fetchKapps = (options = {}) => {
  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/kapps`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ kapps: response.data.kapps }));

  // Translate attributes if requested.
  if (options.xlatAttributes) {
    promise = promise.then(attributeTranslator('attributes', 'kapps'));
  }

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const fetchKapp = (options = {}) => {
  const {
    kappSlug = bundle.kappSlug(),
  } = options;

  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/kapps/${kappSlug}`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ kapp: response.data.kapp }));

  // Translate attributes if requested.
  if (options.xlatAttributes) {
    promise = promise.then(attributeTranslator('attributes', 'kapp'));
  }

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
