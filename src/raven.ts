import * as Raven from 'raven';

const RAVEN_DSN = process.env.CUSTOMCONNSTR_RAVEN_DSN || process.env.RAVEN_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'production';

Raven.config(ENVIRONMENT === 'production' && RAVEN_DSN, {
  autoBreadcrumbs: true,
  captureUnhandledRejections: true
}).install();
