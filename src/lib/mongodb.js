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
  globalForMongo.mongoClient ||
  new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

// Reuse the same MongoDB client in every environment.
globalForMongo.mongoClient = client;

const db = client.db(dbName);

export { client, db };