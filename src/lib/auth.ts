import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const auth = betterAuth({
  database: new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  trustedOrigins: [process.env.CLIENT_URL || '*'],
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
  plugins: [admin()],
});
