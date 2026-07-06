import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

export const createAuth = () =>
  betterAuth({
    database: new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }),
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: [process.env.CLIENT_URL || '*'],
    advanced: {
      database: {
        generateId: 'uuid',
      },
    },
  });
