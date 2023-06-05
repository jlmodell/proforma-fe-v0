// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

// declare module "$env/static/private" {
//   export const ATLAS_MONGODB: string;
// }

export {};

export interface Proforma {
  _id: string;
  date: string;
  name: string;
  address: string;
  city_state_zip: string;
  country: string;
  payment_terms: string;
  customer_po: string;
  merch_total: number;
  shipping_chgs: number;
  drop_ship_fee: number;
  same_day_fee: number;
  misc: number;
  total_amount_due: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
}
export interface Customer {
  _id: string;
  CUST_NBR: string;
  NAME: string;
  ADDRESS: string;
  CITY_STATE_ZIP: string;
  COUNTRY: string;
  CUST_LAST_PO: string;
}
