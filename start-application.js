import chalk from 'chalk';

import config from './node.config.js';
import app from './api/express-application.js';

const server = app.listen(config.API_PORT, function endInit() {
  console.log(
    chalk.green(`Server is listening on port`),
    chalk.cyan(server.address().port),
    chalk.green(`on mode`),
    chalk.cyan(config.NODE_ENV),
  );
});
