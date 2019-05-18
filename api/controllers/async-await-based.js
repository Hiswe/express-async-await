import asyncHandler from 'express-async-handler';

import * as appErrors from '../../helpers/application-errors.js';
import * as db from '../services/db.js';

const faultyJSON = `{
  "foo": 300,
  bar: "baz
}`;

export default {
  syncRequest: asyncHandler(syncRequest),
  syncRequestError: asyncHandler(syncRequestError),
  asyncRequest: asyncRequest,
  customErrorHandling: customErrorHandling,
  // better to wrap on the exports:
  // it's less clutter
  // and easy to spot if we miss one
  asyncHandlerWrapped: asyncHandler(asyncHandlerWrapped),
  // if we forget to catch somewhere Node will throw a
  // • UnhandledPromiseRejectionWarning: Error: validation fail for itemId
  asyncNoWrapper: asyncHandlerWrapped,
  validationRequest: asyncHandler(validationRequest),
  faultyJson: asyncHandler(faultyJson),
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
    // we can throw sooner
    // • this will be handled by our catch()
    // • even other JS errors will be handled (like JSON.parse)
    if (!item) throw appErrors.noItem({ itemId });
    const joinItem = await db.getTableJoinItem(item.joinId);
    res.json(joinItem);
  } catch (error) {
    // any error will be propagated to expressErrorHandler
    next(error);
  }
}

async function customErrorHandling(req, res, next) {
  const { itemId } = req.params;
  try {
    const item = await db.getItem(itemId);
    if (!item) throw appErrors.noItem({ itemId });
    // make a subtle typo
    const joinItem = await db.getTableJoinItem(item.joinID);
    res.json(joinItem);
  } catch (error) {
    // get another error
    next(appErrors.spaceOdyssey());
  }
}

// we can remove the global try/catch by wrapping with express-async-handler
async function asyncHandlerWrapped(req, res, next) {
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
  if (!item) throw appErrors.noItem({ itemId });
  const joinItem = await db.getTableJoinItem(item.joinId);
  throw appErrors.thisIsWrong(joinItem);
}

// this will always throw an error
async function faultyJson(req, res, next) {
  const { itemId } = req.params;
  const item = await db.getItem(itemId);
  if (!item) throw appErrors.noItem({ itemId });
  const joinItem = await db.getTableJoinItem(item.joinId);
  res.json(JSON.parse(faultyJSON));
}
