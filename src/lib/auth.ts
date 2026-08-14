import { betterAuth } from 'better-auth';
import { admin, openAPI } from 'better-auth/plugins';
import { i18n } from '@better-auth/i18n';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { translations } from 'src/utils/translations';
import { PasswordResetEmail } from '../templates/password-reset';
import { Resend } from 'resend';
import { NotifyPasswordChange } from 'src/templates/notify-password-change';

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
    onPasswordReset: async ({ user }) => {
      void (await resend.emails.send({
        from: 'Zhe_nU <noreply@notifications.zhe-nu-tools.ru>',
        to: user.email,
        subject: 'Изменение пароля',
        react: NotifyPasswordChange({
          changeDate: new Date(),
          fullName: user.name,
        }),
      }));
    },
    sendResetPassword: async ({ user, url }) => {
      void (await resend.emails.send({
        from: 'Zhe_nU <noreply@notifications.zhe-nu-tools.ru>',
        to: user.email,
        subject: 'Восстановление пароля',
        react: PasswordResetEmail({ url }),
      }));
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
