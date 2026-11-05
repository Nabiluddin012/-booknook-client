import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is missing.");
}

if (!dbName) {
  throw new Error("DB_NAME is missing.");
}

const globalForMongo = globalThis;

let client = globalForMongo.mongoClient;

if (!client) {
  client = new MongoClient(uri, {
    maxPoolSize: 15,
    minPoolSize: 0,
    maxIdleTimeMS: 10000,
    serverSelectionTimeoutMS: 30000,
  });

  attachDatabasePool(client);

  globalForMongo.mongoClient = client;
}

const db = client.db(dbName);

export { client, db };