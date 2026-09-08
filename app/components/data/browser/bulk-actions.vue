<script lang="ts">
import type {
  BrowserBulkActionsContext,
  BrowserBulkActionsProps,
} from "../../../types/data/browser/bulk-actions";

import { useTemplateRef } from "#imports";
import { useBrowserView } from "../../../composables/browser";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts" generic="T">
const { browser } = defineProps<BrowserBulkActionsProps<T>>();

const el = useTemplateRef<HTMLDivElement>("el");

const { bulkActions, selected } = useBrowserView(browser);

const ctx = useContext<BrowserBulkActionsContext<T>>(
  "data-browser-bulk-actions",
  () => ({ browser, el: el.value }),
);

defineExpose({ ctx });
</script>

<template>
  <div ref="el" class="f-group f-data-browser-bulk-actions">
    <span class="f-span f-data-browser-bulk-actions-count">
      {{ selected.size }} selected
    </span>
    <button
      v-for="bulk in bulkActions"
      :key="bulk.label"
      type="button"
      class="f-button f-data-browser-bulk-action"
      @click="bulk.action(selected)"
    >
      <Icon class="f-icon" fill="currentColor" :name="bulk.icon" />
      {{ bulk.label }}
    </button>
    <button
      type="button"
      class="f-button f-data-browser-bulk-action-clear"
      @click="browser.clearSelection()"
    >
      Clear
    </button>
  </div>
</template>
