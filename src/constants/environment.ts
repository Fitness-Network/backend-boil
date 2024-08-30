import { getMongoUri } from "src/utils/helper";

export type Environment = {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  googleClientId: string;
  googleClientSecret: string;
  botToken: string;
  smtpHost: string;
  smtpPort: number;
  mailUser: string;
  mailPassword: string;
  cancelOrderLink: string;
  cancelOrderRedirect: string;
  frontendUrl: string;
};

const environmentLoader = (): Environment => ({
  port: +(process.env.APP_PORT || 3000),
  mongoUri: getMongoUri(),
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES || '3d',
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  botToken: process.env.BOT_API_TOKEN!,
  smtpHost: process.env.SMTP_HOST!,
  smtpPort: +process.env.SMTP_PORT!,
  mailUser: process.env.MAIL_USER!,
  mailPassword: process.env.MAIL_PASS!,
  cancelOrderLink: process.env.CANCEL_ORDER_LINK!,
  cancelOrderRedirect: process.env.CANCEL_ORDER_REDIRECT!,
  frontendUrl: process.env.FRONTEND_URL!,
});

export default environmentLoader;
