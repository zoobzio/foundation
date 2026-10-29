<script lang="ts">
import type {
  TableBulkActionsContext,
  TableBulkActionsProps,
  TableBulkActionsSlots,
} from "../types/components/table-bulk-actions";

import { useTemplateRef } from "vue";
import { useRefs } from "../composables/ref";
import { useContext } from "../composables/context";
import { TABLE_CLEAR_SELECTION_LABEL } from "../constants/table";
</script>

<script setup lang="ts" generic="T">
const { service } = defineProps<TableBulkActionsProps<T>>();

const el = useTemplateRef<HTMLDivElement>("el");

const { bulkActions, selected } = useRefs(service);

const ctx = useContext<TableBulkActionsContext<T>>(
  "table-bulk-actions",
  () => ({ table: service, el: el.value }),
);

defineExpose({ ctx });
defineSlots<TableBulkActionsSlots<T>>();
</script>

<template>
  <div ref="el" class="f-group f-data-table-bulk-actions">
    <span class="f-span f-data-table-bulk-actions-count">
      {{ selected.size }} selected
    </span>
    <button
      v-for="bulk in bulkActions"
      :key="bulk.key"
      type="button"
      class="f-button f-data-table-bulk-action"
      @click="service.runBulkAction(bulk.key)"
    >
      <slot name="bulkActionPrepend" v-bind="{ ...ctx, action: bulk }" />
      {{ bulk.label }}
      <slot name="bulkActionAppend" v-bind="{ ...ctx, action: bulk }" />
    </button>
    <button
      type="button"
      class="f-button f-data-table-bulk-action-clear"
      @click="service.clearSelection()"
    >
      {{ TABLE_CLEAR_SELECTION_LABEL }}
    </button>
  </div>
</template>
