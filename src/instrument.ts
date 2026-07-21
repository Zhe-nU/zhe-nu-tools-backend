import Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import dotenv from 'dotenv';

dotenv.config();

Sentry.init({
  debug: true,

  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ['error', 'info', 'log'] }),
    nodeProfilingIntegration(),
  ],

  // Send structured logs to Sentry
  enableLogs: true,
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});
