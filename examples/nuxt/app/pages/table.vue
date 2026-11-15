<script setup lang="ts">
import { Table } from "#components";
import { computed } from "vue";
import { useOrders } from "~/composables/orders";

const orders = useOrders();
await orders.init();

// What the next fetch is handed: the page, the sort, and the search.
const params = computed(() => ({
  pagination: orders.table.atoms.pagination.get(),
  sorting: orders.table.atoms.sorting.get(),
  query: orders.query.text,
  filters: orders.query.filters,
}));
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Table</h1>
        <p class="page-lead">
          A page of orders at a time from a fake backend. Press
          <code>/</code> to search: try <code>"hopper"</code>,
          <code>Status: Shipped</code>, or <code>Total: over 300</code>. Sort by
          a header, and by a second with Shift held; a third click clears the
          sort. Drag a header by its grip to move the column, drag its edge to
          resize it.
        </p>
      </div>
    </header>

    <section class="demo">
      <Table :service="orders" />
    </section>

    <section class="output">
      <h2 class="output-title">Fetch params</h2>
      <pre class="output-code"><code>{{ params }}</code></pre>
    </section>
  </div>
</template>
