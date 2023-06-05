import { MongoClient } from "mongodb";
import { ATLAS_MONGODB } from "$env/static/private";
import dotenv from "dotenv";

dotenv.config();

console.log("env__ATLAS_MONGODB", ATLAS_MONGODB);

let uri = process.env.ATLAS_MONGODB;
// let uri = ATLAS_MONGODB;
// if (!uri) {
//   uri = process.env.ATLAS_MONGODB as string;
// }

console.log("uri: ", uri);

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
