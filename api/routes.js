import express from 'express';

import promiseBased from './controllers/promise-based.js';
import awaitBased from './controllers/async-await-based.js';

const routes = express.Router();

// we can mount multiple router
// • less clear to not have the full paths existing
// • easier to rewrite
const promiseRouter = express.Router();
const awaitRouter = express.Router();
routes.use(`/promise`, promiseRouter);
routes.use(`/await`, awaitRouter);

export default routes;

promiseRouter.get(`/sync`, promiseBased.syncRequest);
promiseRouter.get(`/sync-error`, promiseBased.syncRequestError);
promiseRouter.get(`/async/:itemId`, promiseBased.asyncRequest);
promiseRouter.get(`/custom-error/:itemId`, promiseBased.customErrorHandling);
promiseRouter.get(`/wrapper/:itemId`, promiseBased.asyncHandlerWrapped);
promiseRouter.get(`/not-wrapped/:itemId`, promiseBased.asyncNoWrapper);

awaitRouter.get(`/sync`, awaitBased.syncRequest);
awaitRouter.get(`/sync-error`, awaitBased.syncRequestError);
awaitRouter.get(`/async/:itemId`, awaitBased.asyncRequest);
awaitRouter.get(`/custom-error/:itemId`, awaitBased.customErrorHandling);
awaitRouter.get(`/wrapper/:itemId`, awaitBased.asyncHandlerWrapped);
awaitRouter.get(`/not-wrapped/:itemId`, awaitBased.asyncNoWrapper);
awaitRouter.get(`/validation/:itemId`, awaitBased.validationRequest);
