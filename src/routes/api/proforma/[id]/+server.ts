import { json } from "@sveltejs/kit";
import clientPromise from "../../../../lib/server/mongodb";
import { ObjectId } from "mongodb";

export async function GET({ params }) {
  const client = await clientPromise;
  const db = client.db("busse_rolodex");

  const customer = await db.collection("proforma").findOne({
    _id: new ObjectId(params.id),
  });

  return json(customer);
}

export async function POST({ request, params }) {
  const client = await clientPromise;
  const db = client.db("busse_rolodex");

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
    updatedAt,
  };

  const result = await db.collection("proforma").findOneAndUpdate(
    {
      _id: new ObjectId(params.id),
    },
    {
      $set: proforma,
    }
  );

  return json(result);
}
