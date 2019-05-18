import asyncHandler from 'express-async-handler';

import * as appErrors from '../../helpers/application-errors.js';
import * as db from '../services/db.js';

export default {
  syncRequest,
  syncRequestError,
  asyncRequest,
  customErrorHandling,
  // Using express-async-handler with promises is painful to use
  // • need to return be sure to return Promise
  // • it's not the case with async/await because they ALWAYS return a promise
  // • need to be wrapped
  asyncHandlerWrapped: asyncHandler(asyncHandlerWrapped),
  // if we forget to catch somewhere Node will throw a
  // • UnhandledPromiseRejectionWarning: Error: validation fail for itemParam
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
  const { itemParam } = req.params;
  db.getItem(itemParam)
    .then(item => {
      // we can throw sooner
      // • this will be handled by our .catch()
      if (!item) throw appErrors.noItem({ itemParam });
      return db.getTableJoinItem(item.joinId);
    })
    .then(joinItem => {
      res.json(joinItem);
    })
    // any error will be propagated to expressErrorHandler
    .catch(next);
}

function customErrorHandling(req, res, next) {
  const { itemParam } = req.params;
  return db
    .getItem(itemParam)
    .then(item => {
      if (!item) throw appErrors.noItem({ itemParam });
      return db.getTableJoinItem(item.joinId);
    })
    .then(joinItem => {
      res.json(joinItem);
    })
    .catch(error => {
      next(appErrors.spaceOdyssey());
    });
}

function asyncHandlerWrapped(req, res, next) {
  const { itemParam } = req.params;
  // we need to return the Promise for express-async-handler to operate
  return db
    .getItem(itemParam)
    .then(item => {
      if (!item) throw appErrors.noItem({ itemParam });
      return db.getTableJoinItem(item.joinId);
    })
    .then(joinItem => {
      res.json(joinItem);
    });
  // no catch:
  // • should be handled by asyncHandler => expressErrorHandler
  // • IF wrapped correctly
}
