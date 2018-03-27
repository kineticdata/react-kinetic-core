import axios from 'axios';
import { bundle } from '../core-helpers';
import { handleErrors, paramBuilder } from './http';

const validateOptions = (functionName, requiredOptions, options) => {
  const missing = requiredOptions.filter(
    requiredOption => !options[requiredOption],
  );
  if (missing.length > 0) {
    throw new Error(
      `${functionName} failed! The following required options are missing: ${missing}`,
    );
  }
};

export const fetchBridgeModels = (options = {}) => {
  return axios
    .get(`${bundle.apiLocation()}/models`, {
      params: paramBuilder(options),
    })
    .then(response => ({ bridgeModels: response.data.models }))
    .catch(handleErrors);
};

export const fetchBridgeModel = (options = {}) => {
  validateOptions('fetchBridgeModel', ['modelName'], options);
  return axios
    .get(`${bundle.apiLocation()}/models/${options.modelName}`, {
      params: paramBuilder(options),
    })
    .then(response => ({ bridgeModel: response.data.model }))
    .catch(handleErrors);
};
