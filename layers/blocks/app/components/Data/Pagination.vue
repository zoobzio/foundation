<script setup lang="ts">
import type { PaginationStore } from "../../types/common";

const props = defineProps<{
  store: PaginationStore;
}>();

const { page, pageSize, pageCount, total, goToPage } = props.store;

const pageSizeOptions = [
  { value: "5", label: "Show 5" },
  { value: "10", label: "Show 10" },
  { value: "25", label: "Show 25" },
  { value: "50", label: "Show 50" },
];

const hasPrev = computed(() => page.value > 1);
const hasNext = computed(() => page.value < pageCount.value);

const first = () => goToPage(1);
const prev = () => goToPage(page.value - 1);
const next = () => goToPage(page.value + 1);
const last = () => goToPage(pageCount.value);

const pageSizeModel = computed({
  get: () => String(pageSize.value),
  set: (v) => {
    pageSize.value = Number(v);
    goToPage(1);
  },
});

const pageNumbers = computed(() => {
  const pages: (number | "...")[] = [];

  if (pageCount.value <= 7) {
    for (let i = 1; i <= pageCount.value; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page.value > 3) pages.push("...");
    for (let i = Math.max(2, page.value - 1); i <= Math.min(pageCount.value - 1, page.value + 1); i++) {
      pages.push(i);
    }
    if (page.value < pageCount.value - 2) pages.push("...");
    pages.push(pageCount.value);
  }

  return pages;
});
</script>

<template>
  <div class="f-data-pagination">
    <span class="f-data-pagination-info">
      Page {{ page }} of {{ pageCount }} ({{ total }} results)
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
          :disabled="p === '...' || p === page"
          :data-selected="p === page ? '' : undefined"
          @click="typeof p === 'number' && goToPage(p)"
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
