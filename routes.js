import express from 'express';

import promiseBased from './controllers/promise-based';

const routes = express.Router();
const promiseRouter = express.Router();

routes.use(`/promise`, promiseRouter);

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
