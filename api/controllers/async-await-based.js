import asyncHandler from 'express-async-handler';
import createError from 'http-errors';

import * as appErrors from '../../helpers/application-errors.js';
import * as db from '../services/db.js';

export default {
  syncRequest: asyncHandler(syncRequest),
  syncRequestError: asyncHandler(syncRequestError),
  asyncRequest: asyncRequest,
  asyncRequestWithCustomErrorHandling: asyncRequestWithCustomErrorHandling,
  // better to wrap on the exports:
  // it's less clutter
  // and easy to spot if we miss one
  asyncRequestWithWrapper: asyncHandler(asyncRequestWithWrapper),
  // if we forget to catch somewhere Node will throw a
  // • UnhandledPromiseRejectionWarning: Error: validation fail for itemId
  asyncRequestWithoutWrapper: asyncRequestWithWrapper,
  validationRequest: asyncHandler(validationRequest),
};

// we can declare even synchronous request as async
async function syncRequest(req, res) {
  res.json({
    message: `sync request - no errors`,
  });
}

async function syncRequestError(req, res) {
  const myVar = checkThisVarThatDoesNotExists;
  res.json({
    myVar,
    message: `sync request - no errors`,
  });
}

async function asyncRequest(req, res, next) {
  const { itemId } = req.params;
  try {
    const item = await db.getItem(itemId);
    if (!item) throw appErrors.noItem({ itemId });
    const joinItem = await db.getTableJoinItem(item.joinId);
    res.json(joinItem);
  } catch (error) {
    // any error will be propagated to expressErrorHandler
    next(error);
  }
}

async function asyncRequestWithCustomErrorHandling(req, res, next) {
  const { itemId } = req.params;
  try {
    const item = await db.getItem(itemId);
    if (!item) throw appErrors.noItem({ itemId });
    // make a subtle typo
    const joinItem = await db.getTableJoinItem(item.joinID);
    res.json(joinItem);
  } catch (error) {
    // get a very very specific error
    res.json(
      createError(500, `custom error response`, { additionalDetails: `none` }),
    );
  }
}

// we can remove the global try/catch by wrapping with express-async-handler
async function asyncRequestWithWrapper(req, res, next) {
  const { itemId } = req.params;
  const item = await db.getItem(itemId);
  if (!item) throw appErrors.noItem({ itemId });
  const joinItem = await db.getTableJoinItem(item.joinId);
  res.json(joinItem);
}

// this will always throw an error
async function validationRequest(req, res, next) {
  const { itemId } = req.params;
  const item = await db.getItem(itemId);
  if (!item) throw createError.NotFound(`item not found`);
  const joinItem = await db.getTableJoinItem(item.joinId);
  throw appErrors.thisIsWrong(joinItem);
}
