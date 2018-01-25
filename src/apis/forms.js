import axios from 'axios';
import { bundle } from '../core-helpers';
import {
  deserializeAttributes,
  handleErrors,
  paramBuilder,
  formPath,
} from './http';

export const fetchForms = (options = {}) => {
  const { kappSlug = bundle.kappSlug(), datastore } = options;

  // Build URL and fetch the space.
  let promise = axios.get(formPath({ kapp: kappSlug, datastore }), {
    params: paramBuilder(options),
  });
  // Remove the response envelop and leave us with the forms one.
  promise = promise.then(response => ({ forms: response.data.forms }));
  promise = promise.then(deserializeAttributes('attributes', 'forms'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};

export const fetchForm = (options = {}) => {
  const { kappSlug = bundle.kappSlug(), formSlug, datastore } = options;

  if (!formSlug) {
    throw new Error('fetchForm failed! The option "formSlug" is required.');
  }

  // Build URL and fetch the space.
  let promise = axios.get(
    formPath({
      kapp: kappSlug,
      form: formSlug,
      datastore,
    }),
    {
      params: paramBuilder(options),
    },
  );
  // Remove the response envelop and leave us with the form one.
  promise = promise.then(response => ({ form: response.data.form }));
  promise = promise.then(deserializeAttributes('attributes', 'form'));

  // Clean up any errors we receive. Make sure this the last thing so that it cleans up any errors.
  promise = promise.catch(handleErrors);

  return promise;
};
