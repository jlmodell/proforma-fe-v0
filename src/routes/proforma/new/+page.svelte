<script lang="ts">
  import type { Customer } from "../../../app";
  import { onMount } from "svelte";

  const initialCustomer: Customer = {
    _id: "",
    CUST_NBR: "",
    NAME: "",
    ADDRESS: "",
    CITY_STATE_ZIP: "",
    COUNTRY: "",
    CUST_LAST_PO: "",
  };

  let _id: string = "";

  let customers: Customer[] = [];
  let filteredCustomers: Customer[] = [];

  let date = new Date().toISOString().slice(0, 10);

  let customer: Customer = initialCustomer;
  let cust_nbr: string = "";
  let comments: string = "";
  let payment_terms: string = "";
  let customer_po: string = "";

  let timer: NodeJS.Timeout;
  let isOpen: boolean = false;

  function filterCustomers() {
    clearTimeout(timer);
    if (cust_nbr && cust_nbr.length > 2) {
      timer = setTimeout(() => {
        filteredCustomers = customers.filter((customer) => {
          return customer.CUST_NBR.includes(cust_nbr);
        });

        if (filteredCustomers.length === 1) {
          customer = filteredCustomers[0];
        }

        if (filteredCustomers.length > 1) {
          isOpen = true;
        } else {
          isOpen = false;
        }
      }, 300);
    }
  }

  let fees = {
    merch_total: 0.0,
    shipping_chgs: 0.0,
    drop_ship_fee: 0.0,
    same_day_fee: 0.0,
    misc: 0.0,
  };

  let total_amount_due = 0.0;

  function calcTotalAmountDue(event: Event) {
    total_amount_due =
      fees.merch_total +
      fees.shipping_chgs +
      fees.drop_ship_fee +
      fees.same_day_fee +
      fees.misc;

    formatAsCurrency(event);
  }

  function formatAsCurrency(event: Event) {
    const target = event.target as HTMLInputElement;

    target.value = (+target.value).toFixed(2).toString();
  }

  async function getCustomer() {
    filterCustomers();
  }

  function handleCustomerSelection(event: Event) {
    isOpen = false;
    const target = event.target as HTMLLIElement;
    const [selected_cust_nbr, _name] = target.innerText.split(" - ");
    cust_nbr = selected_cust_nbr.trim();
    customer =
      filteredCustomers.find((customer) => customer.CUST_NBR === cust_nbr) ??
      initialCustomer;
  }

  async function save() {
    let response;

    if (cust_nbr === "") {
      const missingCustNbrIsOk = confirm(
        "Customer Number is missing. Is this ok?"
      );

      if (!missingCustNbrIsOk) return;
    }

    if (_id != "") {
      response = await fetch(`/api/proforma/${_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          cust_nbr,
          name: customer.NAME,
          address: customer.ADDRESS,
          city_state_zip: customer.CITY_STATE_ZIP,
          country: customer.COUNTRY,
          payment_terms,
          customer_po,
          ...fees,
          total_amount_due,
          comments,
        }),
      });
    } else {
      response = await fetch("/api/proforma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          cust_nbr,
          name: customer.NAME,
          address: customer.ADDRESS,
          city_state_zip: customer.CITY_STATE_ZIP,
          country: customer.COUNTRY,
          payment_terms,
          customer_po,
          ...fees,
          total_amount_due,
          comments,
        }),
      });
    }

    const data = await response.json();

    if (data.acknowledged) {
      const { insertedId } = data;
      _id = insertedId;
      const reset_after = confirm("Proforma Notice Saved! Reset Form?");
      if (reset_after) {
        reset();
      }
    } else {
      alert("Proforma Notice Not Saved!");
    }
  }

  function reset() {
    cust_nbr = "";
    comments = "";
    payment_terms = "";
    customer_po = "";
    customer = initialCustomer;
    date = new Date().toISOString().slice(0, 10);
    total_amount_due = 0;
    fees = {
      merch_total: 0,
      shipping_chgs: 0,
      drop_ship_fee: 0,
      same_day_fee: 0,
      misc: 0,
    };
  }

  async function saveAndPrint() {
    print();
    await save();
  }

  function print() {
    window.print();
  }

  onMount(async () => {
    const response = await fetch("/api/customers");
    const data = await response.json();
    if (data) {
      customers = data;
    }
  });
</script>

<section class="w-[90vw]">
  <div class="flex flex-col mt-2">
    <img
      src="/images/busse-logo-2x-300x113.png"
      alt="busse logo"
      class="w-[300px]"
    />
    <div class="pl-8 mt-2">
      <p>75 Arkay Drive</p>
      <p>Hauppauge, NY 11788</p>
      <p>800-645-6526</p>
    </div>
  </div>

  <div class="w-full grid place-items-center">
    <h1 class="text-3xl font-semibold underline">Proforma Notice</h1>
  </div>

  <div class="w-full flex justify-end items-center px-2">
    <label for="date" class="mr-2"> Date: </label>
    <input
      type="date"
      name="date"
      id="date"
      bind:value={date}
      class="border border-gray-400 rounded-md p-1"
    />
  </div>

  <div class="w-1/2 p-10 grid grid-cols-2 space-y-3 items-center">
    <label for="cust_nbr" class="mr-2 font-semibold"> Customer Number: </label>
    <input
      type="text"
      name="cust_nbr"
      id="cust_nbr"
      bind:value={cust_nbr}
      on:keyup={getCustomer}
      class="border border-gray-400 focus:border-gray-600 rounded-md p-1 outline-none ring-0 w-1/2"
    />

    {#if isOpen}
      <div class="print:hidden" />
      <ul class="print:hidden">
        {#each filteredCustomers as customer}
          <li
            on:click={handleCustomerSelection}
            on:keypress={handleCustomerSelection}
            class="cursor-pointer hover:bg-slate-300 uppercase"
          >
            {customer.CUST_NBR} - {customer.NAME}
          </li>
        {/each}
      </ul>
    {/if}

    <label for="name" class="mr-2 font-semibold"> Customer Name: </label>
    <input
      type="text"
      name="name"
      id="name"
      bind:value={customer.NAME}
      class="border focus:border-gray-400 outline-none ring-0 border-white rounded-md p-1 uppercase"
    />

    <label for="address" class="mr-2 font-semibold"> Customer Address: </label>
    <input
      type="text"
      name="address"
      id="address"
      bind:value={customer.ADDRESS}
      class="border focus:border-gray-400 outline-none ring-0 border-white rounded-md p-1 uppercase"
    />

    <label for="city_state_zip" class="mr-2 font-semibold">
      Customer City, State, Zip Code:
    </label>
    <input
      type="text"
      name="city_state_zip"
      id="city_state_zip"
      bind:value={customer.CITY_STATE_ZIP}
      class="border focus:border-gray-400 outline-none ring-0 border-white rounded-md p-1 uppercase"
    />

    <label for="country" class="mr-2 font-semibold"> Customer Country: </label>
    <input
      type="text"
      name="country"
      id="country"
      bind:value={customer.COUNTRY}
      class="border focus:border-gray-400 outline-none ring-0 border-white rounded-md p-1 uppercase"
    />

    <label for="payment_terms" class="mr-2 font-semibold mt-4">
      Customer Payment Terms:
    </label>
    <input
      type="text"
      name="payment_terms"
      id="payment_terms"
      bind:value={payment_terms}
      class="border focus:border-gray-400 outline-none ring-0 border-white rounded-md p-1 uppercase"
    />
  </div>

  <div class="pl-8 mt-2 text-xl">
    <p>
      We are in receipt of your purchase order (PO) <span
        ><input
          type="text"
          class="text-center border focus:border-gray-400 outline-none ring-0 border-white rounded-md p-1 uppercase underline"
          bind:value={customer_po}
        /></span
      >
      with a total amount due of
      <span class="underline"
        >{new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(total_amount_due)}</span
      >.
    </p>
  </div>

  <div class="w-1/2 p-10 grid grid-cols-2 space-y-3 items-center">
    <label for="merch_total" class="mr-2 font-semibold">
      Merchandise Total:
    </label>
    <span
      >$
      <input
        name="merch_total"
        type="number"
        bind:value={fees.merch_total}
        on:change={calcTotalAmountDue}
      />
    </span>

    <label for="shipping_chgs" class="mr-2 font-semibold">
      Shipping Charges:
    </label>
    <span
      >$
      <input
        name="shipping_chgs"
        type="number"
        bind:value={fees.shipping_chgs}
        on:change={calcTotalAmountDue}
      />
    </span>

    <label for="drop_ship_fee" class="mr-2 font-semibold">
      Drop Ship Fee:
    </label>
    <span
      >$
      <input
        name="drop_ship_fee"
        type="number"
        bind:value={fees.drop_ship_fee}
        on:change={calcTotalAmountDue}
      />
    </span>

    <label for="same_day_fee" class="mr-2 font-semibold"> Same Day Fee: </label>
    <span
      >$
      <input
        name="same_day_fee"
        type="number"
        bind:value={fees.same_day_fee}
        on:change={calcTotalAmountDue}
      />
    </span>

    <label for="misc" class="mr-2 font-semibold"> Misc Fees: </label>
    <span
      >$ <input
        name="misc"
        type="number"
        bind:value={fees.misc}
        on:change={calcTotalAmountDue}
      /></span
    >
  </div>

  <div class="w-full ml-10 flex flex-col space-y-3">
    <label for="comments"><h3 class="font-semibold">Comments:</h3></label>
    <textarea
      bind:value={comments}
      name="comments"
      rows={10}
      class="w-1/2 border focus:border-gray-400 outline-none ring-0 border-white rounded-md p-1"
    />
  </div>

  <div class="print:hidden absolute bottom-5 left-5 w-1/2">
    <button
      class="w-1/2 p-2 mt-4 bg-emerald-500 text-white rounded-md"
      on:click={saveAndPrint}
    >
      Save & Print
    </button>
    <button
      class="w-1/2 p-2 mt-4 bg-blue-500 text-white rounded-md"
      on:click={save}
    >
      Save
    </button>
    <button
      class="w-1/2 p-2 mt-4 bg-red-500 text-white rounded-md"
      on:click={reset}
    >
      Reset
    </button>
  </div>
</section>

<details class="pre-wrapper absolute bottom-0 right-0 pr-5 pb-2 print:hidden">
  <summary class="italic lowercase">DEBUG</summary>
  <pre class="print:hidden whitespace-pre-line">{JSON.stringify(
      {
        //   filteredCustomers,
        date,
        cust_nbr,
        ...customer,
        _id,
        payment_terms,
        customer_po,
        ...fees,
        total_amount_due,
        comments,
      },
      null,
      2
    )}</pre>
</details>

<style>
  .pre-wrapper {
    max-width: calc(100vw / 4);
  }
</style>
