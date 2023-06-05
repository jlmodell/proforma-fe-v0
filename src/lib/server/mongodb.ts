import { MongoClient } from "mongodb";
import { env as privateEnv } from "$env/dynamic/private";
// import { env as publicEnv } from "$env/dynamic/public";
import dotenv from "dotenv";

dotenv.config();

let uri: string;

if (privateEnv.ATLAS_MONGODB) {
  uri = privateEnv.ATLAS_MONGODB;
} else {
  uri = process.env.ATLAS_MONGODB as string;
}

// let uri = ATLAS_MONGODB;
// if (!uri) {
//   uri = process.env.ATLAS_MONGODB as string;
// }

if (!uri) throw new Error("Missing environment variable ATLAS_MONGODB");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongoClientPromise = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>;
  };

  if (!globalWithMongoClientPromise._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongoClientPromise._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongoClientPromise._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
