<script lang="ts">
import type {
  BrowserBulkActionsContext,
  BrowserBulkActionsProps,
  BrowserBulkActionsSlots,
} from "../types/components/browser-bulk-actions";

import { useTemplateRef } from "vue";
import { useRefs } from "../composables/ref";
import { useContext } from "../composables/context";
import { BROWSER_CLEAR_SELECTION_LABEL } from "../constants/browser";
</script>

<script setup lang="ts" generic="T">
const { service } = defineProps<BrowserBulkActionsProps<T>>();

const el = useTemplateRef<HTMLDivElement>("el");

const { bulkActions, selected } = useRefs(service);

const ctx = useContext<BrowserBulkActionsContext<T>>(
  "browser-bulk-actions",
  () => ({ browser: service, el: el.value }),
);

defineExpose({ ctx });
defineSlots<BrowserBulkActionsSlots<T>>();
</script>

<template>
  <div ref="el" class="f-group f-data-browser-bulk-actions">
    <span class="f-span f-data-browser-bulk-actions-count">
      {{ selected.size }} selected
    </span>
    <button
      v-for="bulk in bulkActions"
      :key="bulk.key"
      type="button"
      class="f-button f-data-browser-bulk-action"
      @click="service.runBulkAction(bulk.key)"
    >
      <slot name="bulkActionPrepend" v-bind="{ ...ctx, action: bulk }" />
      {{ bulk.label }}
      <slot name="bulkActionAppend" v-bind="{ ...ctx, action: bulk }" />
    </button>
    <button
      type="button"
      class="f-button f-data-browser-bulk-action-clear"
      @click="service.clearSelection()"
    >
      {{ BROWSER_CLEAR_SELECTION_LABEL }}
    </button>
  </div>
</template>
