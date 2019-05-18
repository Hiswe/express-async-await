// our own error creator
// • everything should be centralized here
// • thanks to that we won't need to import `http-errors` anywhere else
import createError from 'http-errors';

export function spaceOdyssey(additionalParams = {}) {
  return createError(418, `A Space Odyssey`, {
    errorAppCode: 2001,
    errorInfo: additionalParams,
  });
}

export function noItem(additionalParams = {}) {
  return createError(404, `This item does not exist`, {
    errorAppCode: 2101,
    errorInfo: additionalParams,
  });
}

export function tooManyPredictions(additionalParams = {}) {
  return createError(429, `Too many predictions`, {
    errorAppCode: 3203,
    errorInfo: additionalParams,
  });
}

export function thisIsWrong(additionalParams = {}) {
  return createError(409, `this is wrong`, {
    errorAppCode: 3203,
    errorInfo: additionalParams,
  });
}

export function notImplemented(additionalParams = {}) {
  return createError(501, `this endpoint doesn't exists`, {
    errorAppCode: 1000,
    errorInfo: additionalParams,
  });
}
