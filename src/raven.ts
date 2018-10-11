import * as Raven from 'raven';
import {execSync} from 'child_process';
const SENTRY_DSN = process.env.CUSTOMCONNSTR_SENTRY_DSN || process.env.SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'production';
const RELEASE = execSync('git rev-parse HEAD').toString().slice(0, -1);

Raven.config(ENVIRONMENT === 'production' && SENTRY_DSN, {
  autoBreadcrumbs: true,
  captureUnhandledRejections: true,
  release: RELEASE
}).install();
