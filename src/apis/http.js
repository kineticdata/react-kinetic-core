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

export const handleErrors = ({ data, status, statusText }) => {
  if ([401, 500].includes(status)) {
    // For server-side errors grab the status text and return that.
    return { errors: [statusText] };
  } else if (data.errors) {
    // If the errors returned are from server-side validations or constraints.
    return { errors: data.errors };
  }

  // Catch-all, just assume there's a statusText.
  return { errors: [statusText] };
};

export const paramBuilder = (options) => {
  const params = {};

  if (options.include) {
    params.include = options.include;
  }

  return params;
};
