import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is missing.");
}

if (!dbName) {
  throw new Error("DB_NAME is missing.");
}

const globalForMongo = globalThis;

const client =
  globalForMongo.mongoClient || new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db(dbName);

export { client, db };