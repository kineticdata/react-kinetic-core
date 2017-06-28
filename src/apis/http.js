export const attributeTranslator = (attributeKey, envelop) => (result) => {
  const xlatable = envelop ? result[envelop] : result;

  if (xlatable instanceof Array) {
    // If the item is an array of items then apply the translation to
    // each item in the array and return the mutated result.
    xlatable.forEach(xlat => attributeTranslator(attributeKey)(xlat));
  } else {
    // Attempt to translate the item normally.
    const attributes = xlatable[attributeKey];

    xlatable[attributeKey] = attributes.reduce((attrs, attr) => {
      // eslint-disable-next-line
      attrs[attr.name] = attr.values;
      return attrs;
    }, {});
  }

  return result;
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
