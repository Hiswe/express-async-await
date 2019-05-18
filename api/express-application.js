import express from 'express';
import morgan from 'morgan';
import chalk from 'chalk';
import bodyParser from 'body-parser';

import pkg from '../package.json';
import config from '../node.config.js';
import * as appErrors from '../helpers/application-errors.js';
import routes from './routes';

const app = express();
export default app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//////
// LOGGING
//////

function logRequest(tokens, req, res) {
  const method = chalk.blue(tokens.method(req, res));
  const url = chalk.grey(tokens.url(req, res));
  return `${method} ${url}`;
}

function logResponse(tokens, req, res) {
  const method = chalk.blue(tokens.method(req, res));
  const url = chalk.grey(tokens.url(req, res));
  const status = tokens.status(req, res);
  const statusColor =
    status >= 500
      ? `red`
      : status >= 400
      ? `yellow`
      : status >= 300
      ? `cyan`
      : `green`;
  return `${method} ${url} ${chalk[statusColor](status)}`;
}
app.use(morgan(logRequest, { immediate: true }));
app.use(morgan(logResponse));

//////
// ROUTING
//////

app.use(`/`, routes);
app.get(`/`, (req, res) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
    message: `hello world!`,
  });
});

//////
// ERROR HANDLING
//////

// everything that go there without an error should be treated as a 501
app.all(`/*`, (req, res, next) => next(appErrors.notImplemented()));

app.use(function expressErrorHandler(err, req, res, next) {
  console.log(err);
  // anything can come here
  // • make sure we have the minimum error informations
  const errStatus = err.status || err.statusCode || (err.status = 500);
  const errMessage = err.message || `an error as occurred`;
  const stack = err.stack ? err.stack : new Error(err).stack;
  const errStack = stack.split(`\n`).map(line => line.trim());
  const errorResponse = {
    ...err,
    status: errStatus,
    message: errMessage,
  };
  // we don't want the stack to leak in production mode
  if (config.isDev) errorResponse.stack = errStack;
  res.status(errStatus).json(errorResponse);
});
