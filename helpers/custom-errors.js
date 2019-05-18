import createError from 'http-errors';

export default {
  2001: _2001,
  spaceOdyssey: _2001,
  2101: _2101,
  noItem: _2101,
  3203: _3203,
  tooManyPredictions: _3203,
  3418: _3418,
  thisIsWrong: _3418,
};

function _2001(additionalParams = {}) {
  return createError(418, `A Space Odyssey`, {
    errorAppCode: 2001,
    errorInfo: additionalParams,
  });
}

function _2101(additionalParams = {}) {
  return createError(404, `This item does not exist`, {
    errorAppCode: 2101,
    errorInfo: additionalParams,
  });
}

function _3203(additionalParams = {}) {
  return createError(429, `Too many predictions`, {
    errorAppCode: 3203,
    errorInfo: additionalParams,
  });
}

function _3418(additionalParams = {}) {
  return createError(409, `this is wrong`, {
    errorAppCode: 3203,
    errorInfo: additionalParams,
  });
}
