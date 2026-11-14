<script setup lang="ts">
import { NuxtLink, Table } from "#components";
import { useUntheme } from "#imports";
import { computed } from "vue";
import { useOrders } from "~/composables/orders";

const untheme = useUntheme();
const dark = computed(() => untheme.config.input.color === "dark");
const toggle = () => untheme.swap("color", dark.value ? "light" : "dark");

const orders = useOrders();
await orders.init();

// What the next fetch is handed: the page, the sort, and the search.
const params = computed(() => ({
  page: orders.page,
  pageSize: orders.pageSize,
  sortField: orders.sortField,
  sortDirection: orders.sortDirection,
  query: orders.query.text,
  filters: orders.query.filters,
}));
</script>

<template>
  <div class="page page-wide">
    <header class="page-header">
      <div>
        <h1 class="page-title">Table</h1>
        <p class="page-lead">
          A page of orders at a time from a fake backend. Press
          <code>/</code> to search: try <code>"hopper"</code>,
          <code>Status: Shipped</code>, or <code>Total: over 300</code>. Sort by
          a header, drag one by its grip to move the column, drag its edge to
          resize it. <NuxtLink to="/">The editor</NuxtLink>,
          <NuxtLink to="/calendar">the calendar</NuxtLink>, and
          <NuxtLink to="/browser">the browser</NuxtLink> are the other pages.
        </p>
      </div>
      <button type="button" class="page-scheme" @click="toggle">
        {{ dark ? "Light" : "Dark" }}
      </button>
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
