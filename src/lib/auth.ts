import { betterAuth } from 'better-auth';
import { admin, openAPI } from 'better-auth/plugins';
import { i18n } from '@better-auth/i18n';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { translations } from 'src/utils/translations';
import { PasswordResetEmail } from '../templates/password-reset';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
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
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void resend.emails.send({
        from: 'security@notifications.zhe-nu-tools.ru',
        to: user.email,
        subject: 'Восстановление пароля',
        react: PasswordResetEmail({ url }),
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  plugins: [
    admin(),
    i18n({
      translations,
    }),
    openAPI(),
  ],
  trustedOrigins: [process.env.CLIENT_URL || '*'],
});
