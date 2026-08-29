<script lang="ts">
import type {
  TableBulkActionsContext,
  TableBulkActionsProps,
} from "../../../types/data/table/bulk-actions";

import { useTemplateRef } from "#imports";
import { useTableView } from "../../../composables/table";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts" generic="T">
const { table } = defineProps<TableBulkActionsProps<T>>();

const el = useTemplateRef<HTMLDivElement>("el");

const { bulkActions, selected } = useTableView(table);

const ctx = useContext<TableBulkActionsContext<T>>(
  "data-table-bulk-actions",
  () => ({ table, el: el.value }),
);

defineExpose({ ctx });
</script>

<template>
  <div ref="el" class="f-group f-data-table-bulk-actions">
    <span class="f-span f-data-table-bulk-actions-count">
      {{ selected.size }} selected
    </span>
    <button
      v-for="bulk in bulkActions"
      :key="bulk.label"
      type="button"
      class="f-button f-data-table-bulk-action"
      @click="bulk.action(selected)"
    >
      <Icon class="f-icon" fill="currentColor" :name="bulk.icon" />
      {{ bulk.label }}
    </button>
    <button
      type="button"
      class="f-button f-data-table-bulk-action-clear"
      @click="table.clearSelection()"
    >
      Clear
    </button>
  </div>
</template>
