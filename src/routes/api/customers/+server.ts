import { json } from "@sveltejs/kit";
import clientPromise from "../../../lib/server/mongodb";

export async function GET({ request }) {
  const client = await clientPromise;
  const db = client.db("busse_rolodex");

  const customers = await db.collection("customers").find({}).toArray();

  return json(customers);
}
