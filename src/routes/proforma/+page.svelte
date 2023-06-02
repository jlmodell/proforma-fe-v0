<script lang="ts">
  import type { Proforma } from "../../app";
  import { onMount } from "svelte";
  let proformas: Proforma[] = [];

  let filteredProformas: Proforma[] = [];

  let searchTerm = "";

  let timer: NodeJS.Timeout;

  function filterProformas() {
    clearTimeout(timer);
    if (searchTerm === "") {
      filteredProformas = proformas.slice(0, 10);
    } else {
      timer = setTimeout(() => {
        filteredProformas = proformas
          .filter(
            (proforma) =>
              proforma.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              proforma.customer_po
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
          .slice(0, 10);
      }, 300);
    }
  }

  onMount(async () => {
    const res = await fetch("/api/proforma");
    const data = await res.json();
    if (data) {
      proformas = data;
      filteredProformas = proformas.slice(0, 10);
    }
  });
</script>

<section class="flex flex-col justify-start items-center pt-10 w-full h-screen">
  <div>
    <h1 class="font-semibold text-2xl text-center underline">Proformas</h1>

    <ul class="w-1/2 mx-auto border border-gray-500 rounded-md p-2 pl-6 mt-3">
      <li class="list-disc">
        This page is a listing of all saved proformas in the database, use the
        search feature to narrow the list down.
      </li>
      <li class="list-disc">
        You can search by customer name, customer number, customer purchase
        order.
      </li>
      <li class="list-disc">
        Case is <span class="font-semibold underline">not</span> sensitive.
      </li>
    </ul>

    <div class="mx-auto w-full flex flex-col justify-center items-center">
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search..."
        bind:value={searchTerm}
        on:input={filterProformas}
        class="my-5 px-4 py-2 rounded-md border border-gray-300 focus:border-gray-500"
      />

      <ul class="flex flex-col space-y-2">
        {#each filteredProformas as proforma}
          <li class="hover:bg-slate-500 hover:text-white px-4 py-2 rounded-md">
            <a href={`/proforma/${proforma._id}`}
              >{proforma.name} - {proforma.customer_po}</a
            >
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>
