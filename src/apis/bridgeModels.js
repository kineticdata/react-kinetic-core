import axios from 'axios';
import { bundle } from '../core-helpers';
import { handleErrors, paramBuilder } from './http';

const validateOptions = (functionName, options) => {
  if (!options.modelName) {
    throw new Error(
      `${functionName} failed! The option "modelName" is required.`,
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
  validateOptions('fetchBridgeModel', options);
  return axios
    .get(`${bundle.apiLocation()}/models/${options.modelName}`, {
      params: paramBuilder(options),
    })
    .then(response => ({ bridgeModel: response.data.model }))
    .catch(handleErrors);
};
