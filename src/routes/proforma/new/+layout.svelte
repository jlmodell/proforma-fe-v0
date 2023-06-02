<script>
  import "../../../app.css";
</script>

<main>
  <nav class="absolute top-2 right-2 print:hidden text-right">
    <ul>
      <li>
        <a
          href="/"
          class="hover:bg-slate-600/50 px-2 py-1 rounded-md hover:text-white"
          >Home</a
        >
      </li>
      <li>
        <a
          href="/proforma"
          class="hover:bg-slate-600/50 px-2 py-1 rounded-md hover:text-white"
          >Lookup Saved Proforma</a
        >
      </li>
      <li>
        <a
          href="/proforma/new"
          class="hover:bg-slate-600/50 px-2 py-1 rounded-md hover:text-white"
          >Create New Proforma</a
        >
      </li>
    </ul>
  </nav>
  <slot />
</main>
