<script setup lang="ts">
import { Browser, NuxtLink } from "#components";
import { useUntheme } from "#imports";
import { computed } from "vue";
import { useAssets } from "~/composables/assets";

const untheme = useUntheme();
const dark = computed(() => untheme.config.input.color === "dark");
const toggle = () => untheme.swap("color", dark.value ? "light" : "dark");

const assets = useAssets();
await assets.init();

// What the next fetch is handed: the folder, the sort, and the search.
const params = computed(() => ({
  path: assets.pathKeys,
  sortField: assets.sortField,
  sortDirection: assets.sortDirection,
  query: assets.query.text,
  filters: assets.query.filters,
}));
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Browser</h1>
        <p class="page-lead">
          A folder tree over a fake backend. The search is the current folder's:
          try <code>"logo"</code>, <code>Kind: Image</code>, or
          <code>Size: over 10</code> (megabytes), then open a folder and watch
          it clear. <NuxtLink to="/">The editor</NuxtLink> and
          <NuxtLink to="/calendar">the calendar</NuxtLink> are the other pages.
        </p>
      </div>
      <button type="button" class="page-scheme" @click="toggle">
        {{ dark ? "Light" : "Dark" }}
      </button>
    </header>

    <section class="demo">
      <Browser :service="assets" />
    </section>

    <section class="output">
      <h2 class="output-title">Fetch params</h2>
      <pre class="output-code"><code>{{ params }}</code></pre>
    </section>
  </div>
</template>
