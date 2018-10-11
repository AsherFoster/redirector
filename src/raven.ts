import * as Raven from 'raven';

const SENTRY_DSN = process.env.CUSTOMCONNSTR_SENTRY_DSN || process.env.SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'production';

Raven.config(ENVIRONMENT === 'production' && SENTRY_DSN, {
  autoBreadcrumbs: true,
  captureUnhandledRejections: true
}).install();
