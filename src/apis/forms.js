import axios from 'axios';
import { bundle } from '../core-helpers';
import { attributeTranslator, handleErrors, paramBuilder } from './http';

export const fetchForms = (options = {}) => {
  const {
    kappSlug = bundle.kappSlug(),
  } = options;

  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/kapps/${kappSlug}/forms`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ forms: response.data.forms }));

  // Translate attributes if requested.
  if (options.xlatAttributes) {
    promise = promise.then(attributeTranslator('attributes', 'forms'));
  }

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const fetchForm = (options = {}) => {
  const {
    kappSlug = bundle.kappSlug(),
    formSlug,
  } = options;

  if (!formSlug) {
    throw new Error('fetchForm failed! The option "formSlug" is required.');
  }

  // Build URL and fetch the space.
  let promise = axios.get(`${bundle.apiLocation()}/kapps/${kappSlug}/forms/${formSlug}`, {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the space one.
  promise = promise.then(response => ({ form: response.data.form }));

  // Translate attributes if requested.
  if (options.xlatAttributes) {
    promise = promise.then(attributeTranslator('attributes', 'form'));
  }

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
