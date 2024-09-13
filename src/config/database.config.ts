import { registerAs } from "@nestjs/config";

export interface MongoConfig {
  uri: string;
  user: string;
  pass: string;
  db: string;
  host: string;
  port: string;
}
export const mongoConfigLoader = registerAs<MongoConfig>('database', () => {

  const user = process.env.MONGO_USER!;
  const pass = process.env.MONGO_PASS!;
  const db = process.env.MONGO_DB!;
  const host = process.env.MONGO_HOST!;
  const port = process.env.MONGO_PORT!;

  let uri: string = '';
  if (process.env.MONGO_URI) uri = process.env.MONGO_URI;
  else if (!user || !pass) uri = `mongodb://${host}:${port}/${db}?authSource=admin`;
  else uri = `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`

  return {
    uri,
    user,
    pass,
    db,
    host,
    port
  }
})
