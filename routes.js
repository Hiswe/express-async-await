import express from 'express';

import promiseBased from './controllers/promise-based.js';
import asyncAwaitBased from './controllers/async-await-based.js';

const routes = express.Router();
const promiseRouter = express.Router();
const asyncAwaitRouter = express.Router();

routes.use(`/promise`, promiseRouter);
routes.use(`/async-await`, asyncAwaitRouter);

export default routes;

promiseRouter.get(`/sync`, promiseBased.syncRequest);
promiseRouter.get(`/sync-error`, promiseBased.syncRequestError);
promiseRouter.get(`/async/:itemId`, promiseBased.asyncRequest);
promiseRouter.get(
  `/async-custom-error/:itemId`,
  promiseBased.asyncRequestWithCustomErrorHandling,
);
promiseRouter.get(
  `/async-wrapper/:itemId`,
  promiseBased.asyncRequestWithWrapper,
);
promiseRouter.get(
  `/async-wrapper-not-wrapped/:itemId`,
  promiseBased.asyncRequestWithoutWrapper,
);

asyncAwaitRouter.get(`/sync`, asyncAwaitBased.syncRequest);
asyncAwaitRouter.get(`/sync-error`, asyncAwaitBased.syncRequestError);
asyncAwaitRouter.get(`/async/:itemId`, asyncAwaitBased.asyncRequest);
asyncAwaitRouter.get(
  `/async-custom-error/:itemId`,
  asyncAwaitBased.asyncRequestWithCustomErrorHandling,
);
asyncAwaitRouter.get(
  `/async-wrapper/:itemId`,
  asyncAwaitBased.asyncRequestWithWrapper,
);
asyncAwaitRouter.get(
  `/async-wrapper-not-wrapped/:itemId`,
  asyncAwaitBased.asyncRequestWithoutWrapper,
);
asyncAwaitRouter.get(`/validation/:itemId`, asyncAwaitBased.validationRequest);
