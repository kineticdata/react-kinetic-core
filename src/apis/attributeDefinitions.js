import axios from 'axios';
import { bundle } from '../core-helpers';
import { handleErrors, headerBuilder, paramBuilder } from './http';

const validateOptions = (functionName, requiredOptions, options) => {
  const validAttributes = [
    'spaceAttributeDefinitions',
    'teamAttributeDefinitions',
    'userAttributeDefinitions',
    'userProfileAttributeDefinitions',
    'categoryAttributeDefinitions',
    'kappAttributeDefinitions',
    'formAttributeDefinitions',
    'datastoreFormAttributeDefinitions',
  ];

  const attributesRequiringKapp = [
    'categoryAttributeDefinitions',
    'kappAttributeDefinitions',
    'formAttributeDefinitions',
  ];

  const kappSlugMissing =
    attributesRequiringKapp.includes(options.attributeType) &&
    !options.kappSlug;

  const invalidType = !validAttributes.includes(options.attributeType);

  const missing = requiredOptions.filter(
    requiredOption => !options[requiredOption],
  );

  if (missing.length > 0) {
    throw new Error(
      `${functionName} failed! The following required options are missing: ${missing}`,
    );
  }
  if (kappSlugMissing) {
    throw new Error(
      `${functionName} failed! A kappSlug is required when using ${
        options.attributeType
      }`,
    );
  }
  if (invalidType) {
    throw new Error(
      `${functionName} failed! The provided attributeType (${
        options.attributeType
      }) is not valid`,
    );
  }
};

const buildEndpoint = ({ attributeType, kappSlug, name }) => {
  const basePath = kappSlug
    ? `${bundle.apiLocation()}/kapps/${kappSlug}/${attributeType}`
    : `${bundle.apiLocation()}/${attributeType}`;
  return name ? `${basePath}/${name}` : basePath;
};

const buildBody = options => ({
  ...(options.name && { name: options.name }),
  ...(options.allowsMultiple && { allowsMultiple: options.allowsMultiple }),
  ...(options.description && { description: options.description }),
});

export const fetchAttributeDefinitions = (options = {}) => {
  validateOptions('fetchAttributeDefinitions', ['attributeType'], options);
  const { attributeType } = options;
  return axios
    .get(buildEndpoint(options), {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ attributeDefinitions: response.data[attributeType] }))
    .catch(handleErrors);
};

export const fetchAttributeDefinition = (options = {}) => {
  validateOptions(
    'fetchAttributeDefinition',
    ['attributeType', 'name'],
    options,
  );
  const { attributeType } = options;
  // The API returns the singular name of the attribute type, so we remove the "s"
  const responseEnvelope = attributeType.slice(0, -1);
  return axios
    .get(buildEndpoint(options), {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      attributeDefinition: response.data[responseEnvelope],
    }))
    .catch(handleErrors);
};

export const createAttributeDefinition = (options = {}) => {
  validateOptions(
    'createAttributeDefinition',
    ['attributeType', 'name'],
    options,
  );
  const { attributeType } = options;
  // For Creates, we don't append the name to the basePath (it goes in the body)
  // so not using the buildEndpoint function
  const basePath = options.kappSlug
    ? `${bundle.apiLocation()}/kapps/${options.kappSlug}/${attributeType}`
    : `${bundle.apiLocation()}/${attributeType}`;
  // The API returns the singular name of the attribute type, so we remove the "s"
  const responseEnvelope = attributeType.slice(0, -1);
  return axios
    .post(basePath, buildBody(options), {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      attributeDefinition: response.data[responseEnvelope],
    }))
    .catch(handleErrors);
};

export const updateAttributeDefinition = (options = {}) => {
  validateOptions(
    'updateAttributeDefinition',
    ['attributeType', 'name'],
    options,
  );
  const { attributeType } = options;
  // The API returns the singular name of the attribute type, so we remove the "s"
  const responseEnvelope = attributeType.slice(0, -1);
  return axios
    .put(buildEndpoint(options), buildBody(options), {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      attributeDefinition: response.data[responseEnvelope],
    }))
    .catch(handleErrors);
};
