import util from 'util';
import express from 'express';
import morgan from 'morgan';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import createError from 'http-errors';

import pkg from './package.json';
import config from './node.config.js';
import routes from './routes';

const app = express();

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
app.all(`/*`, (req, res, next) => next(new createError.NotImplemented()));

app.use(function expressErrorHandler(err, req, res, next) {
  const errStatus = err.status || err.statusCode || (err.status = 500);
  const errMessage = err.message || `an error as occurred`;
  console.log(err);
  const stack = err.stack ? err.stack : new Error(err).stack;
  const errStack = stack.split(`\n`).map(line => line.trim());
  res.status(errStatus).json({
    ...err,
    status: errStatus,
    message: errMessage,
    stack: errStack,
  });
});

//////
// LAUNCHING
//////

const server = app.listen(config.API_PORT, function endInit() {
  console.log(
    chalk.green(`Server is listening on port`),
    chalk.cyan(server.address().port),
    chalk.green(`on mode`),
    chalk.cyan(config.NODE_ENV),
  );
});
