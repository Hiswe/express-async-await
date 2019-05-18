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
promiseRouter.get(`/async/:itemParam`, promiseBased.asyncRequest);
promiseRouter.get(`/custom-error/:itemParam`, promiseBased.customErrorHandling);
promiseRouter.get(`/wrapper/:itemParam`, promiseBased.asyncHandlerWrapped);
promiseRouter.get(`/not-wrapped/:itemParam`, promiseBased.asyncNoWrapper);

// because we have wrapped (or not) our exports with express-async-handler
// we don't need to take care of it here
// everything that has been exported should be OK
awaitRouter.get(`/sync`, awaitBased.syncRequest);
awaitRouter.get(`/sync-error`, awaitBased.syncRequestError);
awaitRouter.get(`/async/:itemParam`, awaitBased.asyncRequest);
awaitRouter.get(`/custom-error/:itemParam`, awaitBased.customErrorHandling);
awaitRouter.get(`/wrapper/:itemParam`, awaitBased.asyncHandlerWrapped);
awaitRouter.get(`/not-wrapped/:itemParam`, awaitBased.asyncNoWrapper);
awaitRouter.get(`/validation/:itemParam`, awaitBased.validationRequest);
awaitRouter.get(`/faulty-json/:itemParam`, awaitBased.faultyJson);
