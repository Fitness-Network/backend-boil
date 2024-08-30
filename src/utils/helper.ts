import otp from 'otp-generator';

export const getMongoUri = () => {

  if (process.env.MONGO_URL) return process.env.MONGO_URL;

  let mongoUrl = '';
  if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
    mongoUrl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;
    return mongoUrl;
  }
  mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
  return mongoUrl;
};

export function generateReferralCode() {
  return otp.generate(10, {
    specialChars: false
  })
}

export type ValueOf<T> = T[keyof T];
