import { json } from "@sveltejs/kit";
import clientPromise from "../../../lib/server/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("busse_rolodex");

  const proforma = await db.collection("proforma").find({}).toArray();

  return json(proforma);
}

export async function POST({ request }) {
  const client = await clientPromise;
  const db = client.db("busse_rolodex");

  const createdAt = new Date();
  const updatedAt = new Date();

  const {
    date,
    name,
    address,
    city_state_zip,
    country,
    payment_terms,
    customer_po,
    merch_total,
    shipping_chgs,
    drop_ship_fee,
    same_day_fee,
    misc,
    total_amount_due,
    comments,
  } = await request.json();

  const proforma = {
    date,
    name,
    address,
    city_state_zip,
    country,
    payment_terms,
    customer_po,
    merch_total,
    shipping_chgs,
    drop_ship_fee,
    same_day_fee,
    misc,
    total_amount_due,
    comments,
    createdAt,
    updatedAt,
  };

  const result = await db.collection("proforma").insertOne(proforma);

  return json(result);
}
