import asyncHandler from 'express-async-handler';
import createError from 'http-errors';

import * as db from '../fake-db/index.js';

export default {
  syncRequest,
  syncRequestError,
  asyncRequest,
  asyncRequestWithCustomErrorHandling,
  // painful to use :
  // • need to return a Promise…
  asyncRequestWithWrapper: asyncHandler(asyncRequestWithWrapper),
  // if we forget to catch somewhere Node will throw a
  // • UnhandledPromiseRejectionWarning: Error: validation fail for itemId
  asyncRequestWithoutWrapper: asyncRequestWithWrapper,
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
      return db.getTableJoinItem(item.joinId);
    })
    .then(joinItem => {
      res.json(joinItem);
    })
    // any error will be propagated to expressErrorHandler
    .catch(next);
}

function asyncRequestWithCustomErrorHandling(req, res, next) {
  const { itemId } = req.params;
  return db
    .getItem(itemId)
    .then(item => {
      // make a subtle typo
      return db.getTableJoinItem(item.joinID);
    })
    .then(joinItem => {
      res.json(joinItem);
    })
    .catch(error => {
      res.json(createError.NotFound(`custom error response`));
    });
}

function asyncRequestWithWrapper(req, res, next) {
  const { itemId } = req.params;
  // we need to return the Promise for express-async-handler to operate
  return db
    .getItem(itemId)
    .then(item => {
      return db.getTableJoinItem(item.joinId);
    })
    .then(joinItem => {
      res.json(joinItem);
    });
  // no catch:
  // • should be handled by asyncHandler => expressErrorHandler
  // • IF wrapped correctly
}
