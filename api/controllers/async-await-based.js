import asyncHandler from 'express-async-handler';

import * as appErrors from '../../helpers/application-errors.js';
import * as db from '../services/db.js';

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
  // • UnhandledPromiseRejectionWarning: Error: validation fail for itemParam
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
  const { itemParam } = req.params;
  try {
    const item = await db.getItem(itemParam);
    // we can throw sooner
    // • this will be handled by our catch()
    // • even other JS errors will be handled (like JSON.parse)
    if (!item) throw appErrors.noItem({ itemParam });
    const joinItem = await db.getTableJoinItem(item.joinId);
    res.json(joinItem);
  } catch (error) {
    // any error will be propagated to expressErrorHandler
    next(error);
  }
}

async function customErrorHandling(req, res, next) {
  const { itemParam } = req.params;
  try {
    const item = await db.getItem(itemParam);
    if (!item) throw appErrors.noItem({ itemParam });
    const joinItem = await db.getTableJoinItem(item.joinId);
    res.json(joinItem);
  } catch (error) {
    // get another error
    next(appErrors.spaceOdyssey());
  }
}

// Above we are repeating a global try/catch
// • we can remove it by wrapping with express-async-handler
// • be careful to wrapped it in the exports!
async function asyncHandlerWrapped(req, res, next) {
  const { itemParam } = req.params;
  const item = await db.getItem(itemParam);
  if (!item) throw appErrors.noItem({ itemParam });
  const joinItem = await db.getTableJoinItem(item.joinId);
  res.json(joinItem);
}

// this will always throw an error
async function validationRequest(req, res, next) {
  const { itemParam } = req.params;
  const item = await db.getItem(itemParam);
  if (!item) throw appErrors.noItem({ itemParam });
  const joinItem = await db.getTableJoinItem(item.joinId);
  throw appErrors.thisIsWrong(joinItem);
}

// the bad JSON.parse will be catched!
const faultyJSON = `{
  "foo": 300,
  bar: "baz
}`;
async function faultyJson(req, res, next) {
  const { itemParam } = req.params;
  const item = await db.getItem(itemParam);
  if (!item) throw appErrors.noItem({ itemParam });
  const joinItem = await db.getTableJoinItem(item.joinId);
  res.json(JSON.parse(faultyJSON));
}
