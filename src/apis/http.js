export const deserializeAttributes = (attributeKey, envelop) => (result) => {
  const xlatable = envelop ? result[envelop] : result;

  if (xlatable instanceof Array) {
    // If the item is an array of items then apply the translation to
    // each item in the array and return the mutated result.
    xlatable.forEach(xlat => deserializeAttributes(attributeKey)(xlat));
  } else {
    // Attempt to translate the item normally.
    const attributes = xlatable[attributeKey];

    if (!(xlatable[attributeKey] instanceof Array)) {
      return result;
    }

    xlatable[attributeKey] = attributes.reduce((attrs, attr) => {
      // eslint-disable-next-line
      attrs[attr.name] = attr.values;
      return attrs;
    }, {});
  }

  return result;
};

export const serializeAttributes = (xlatable, attributeKey) => {
  const attributes = xlatable[attributeKey];

  // Do not try and serialize attribute sets that are already lists.
  if (xlatable[attributeKey] instanceof Array) {
    return xlatable;
  }

  // Serialize the Object form into a List form.
  // eslint-disable-next-line no-param-reassign
  xlatable[attributeKey] = Object.keys(attributes)
    .map(key => ({ name: key, values: attributes[key] }), []);

  return xlatable;
};


export const handleErrors = (error) => {
  const { data, status, statusText } = error.response;
  if (status === 400 && typeof data === 'object') {
    // If the errors returned are from server-side validations or constraints.
    return data.errors ? { errors: data.errors } : data;
  }

  // For all other server-side errors.
  return { serverError: { status, statusText } };
};

export const paramBuilder = (options) => {
  const params = {};

  if (options.include) {
    params.include = options.include;
  }

  return params;
};
