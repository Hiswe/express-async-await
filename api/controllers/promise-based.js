import asyncHandler from 'express-async-handler';
import createError from 'http-errors';

import * as appErrors from '../../helpers/application-errors.js';
import * as db from '../services/db.js';

export default {
  syncRequest,
  syncRequestError,
  asyncRequest,
  customErrorHandling,
  // painful to use :
  // • need to return a Promise…
  asyncHandlerWrapped: asyncHandler(asyncHandlerWrapped),
  // if we forget to catch somewhere Node will throw a
  // • UnhandledPromiseRejectionWarning: Error: validation fail for itemId
  asyncNoWrapper: asyncHandlerWrapped,
};

function syncRequest(req, res) {
  res.json({
    message: `sync request - no errors`,
  });
}

function syncRequestError(req, res) {
  const myVar = checkThisVarThatDoesNotExists;
  res.json({
    myVar,
    message: `sync request - no errors`,
  });
}

function asyncRequest(req, res, next) {
  const { itemId } = req.params;
  db.getItem(itemId)
    .then(item => {
      if (!item) throw appErrors.noItem({ itemId });
      return db.getTableJoinItem(item.joinId);
    })
    .then(joinItem => {
      res.json(joinItem);
    })
    // any error will be propagated to expressErrorHandler
    .catch(next);
}

function customErrorHandling(req, res, next) {
  const { itemId } = req.params;
  return db
    .getItem(itemId)
    .then(item => {
      if (!item) throw appErrors.noItem({ itemId });
      // make a subtle typo
      return db.getTableJoinItem(item.joinID);
    })
    .then(joinItem => {
      res.json(joinItem);
    })
    .catch(error => {
      next(appErrors.spaceOdyssey());
    });
}

function asyncHandlerWrapped(req, res, next) {
  const { itemId } = req.params;
  // we need to return the Promise for express-async-handler to operate
  return db
    .getItem(itemId)
    .then(item => {
      if (!item) throw appErrors.noItem({ itemId });
      return db.getTableJoinItem(item.joinId);
    })
    .then(joinItem => {
      res.json(joinItem);
    });
  // no catch:
  // • should be handled by asyncHandler => expressErrorHandler
  // • IF wrapped correctly
}
