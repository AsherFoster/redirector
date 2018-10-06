import * as Raven from 'raven';
import config from './config';

const RAVEN_DSN = process.env.CUSTOMCONNSTR_RAVEN_DSN || process.env.RAVEN_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'production';

Raven.config(ENVIRONMENT === 'production' && config.sentry.dsn, {
  autoBreadcrumbs: true,
  captureUnhandledRejections: true
}).install();
