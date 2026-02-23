<script setup lang="ts">
import type { PaginationStore } from "../../types/common";

const { store } = defineProps<{
  store: PaginationStore;
}>();

const pageSizeOptions = [
  { value: "5", label: "Show 5" },
  { value: "10", label: "Show 10" },
  { value: "25", label: "Show 25" },
  { value: "50", label: "Show 50" },
];

const hasPrev = computed(() => store.page.value > 1);
const hasNext = computed(() => store.page.value < store.pageCount.value);

const first = () => store.goToPage(1);
const prev = () => store.goToPage(store.page.value - 1);
const next = () => store.goToPage(store.page.value + 1);
const last = () => store.goToPage(store.pageCount.value);

const pageSizeModel = computed({
  get: () => String(store.pageSize.value),
  set: (v) => { store.pageSize.value = Number(v); },
});

const pageNumbers = computed(() => {
  const total = store.pageCount.value;
  const current = store.page.value;
  const pages: (number | "...")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return pages;
});
</script>

<template>
  <div class="f-data-pagination">
    <span class="f-data-pagination-info">
      Page {{ store.page.value }} of {{ store.pageCount.value }}
    </span>

    <div class="f-data-pagination-pages">
      <Fab :disabled="!hasPrev" @click="first">
        <Icon alias="chevron-first" />
      </Fab>

      <Fab :disabled="!hasPrev" @click="prev">
        <Icon alias="chevron-left" />
      </Fab>

      <div class="f-data-pagination-numbers">
        <button
          v-for="(p, i) in pageNumbers"
          :key="i"
          type="button"
          class="f-data-pagination-number"
          :disabled="p === '...' || p === store.page.value"
          :data-selected="p === store.page.value ? '' : undefined"
          @click="typeof p === 'number' && store.goToPage(p)"
        >
          {{ p }}
        </button>
      </div>

      <Fab :disabled="!hasNext" @click="next">
        <Icon alias="chevron-right" />
      </Fab>

      <Fab :disabled="!hasNext" @click="last">
        <Icon alias="chevron-last" />
      </Fab>
    </div>

    <Select
      v-model="pageSizeModel"
      :options="pageSizeOptions"
    />
  </div>
</template>
