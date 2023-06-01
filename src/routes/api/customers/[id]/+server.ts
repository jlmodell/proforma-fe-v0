import { json } from "@sveltejs/kit";
import clientPromise from "../../../../lib/server/mongodb";

export async function GET({ params }) {
  const client = await clientPromise;
  const db = client.db("busse_rolodex");

  const customer = await db.collection("customers").findOne({
    CUST_NBR: params.id,
  });

  return json(customer);
}
