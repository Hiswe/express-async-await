import rc from 'rc';

import pkg from './package.json';

const config = rc(`expressapp`, {
  API_PORT: 3000,
});

config.NODE_ENV = config.NODE_ENV || process.env.NODE_ENV || `development`;
config.isDev = config.NODE_ENV === `development`;
config.isProd = config.NODE_ENV === `production`;

export default config;
