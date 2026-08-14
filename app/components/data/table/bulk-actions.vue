<script lang="ts">
import type {
  TableBulkActionsContext,
  TableBulkActionsPassthrough,
  TableBulkActionsProps,
} from "../../../types/data/table/bulk-actions";
import type { ComponentPublicInstance } from "vue";

import Button from "../../common/button.vue";
import Group from "../../common/group.vue";
import Icon from "../../common/icon.vue";
import Span from "../../common/span.vue";

import { useTemplateRef } from "#imports";
import { useTable } from "../../../composables/table";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { table, pt } = defineProps<TableBulkActionsProps<T, K>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const { bulkActions, selected } = useTable(table);

const settings = usePassthrough<TableBulkActionsPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    count: {},
    action: {},
    actionIcon: {},
    clear: { onClick: () => table.clearSelection() },
  },
}));

const ctx = useContext<TableBulkActionsContext<T, K>>(
  "data-table-bulk-actions",
  () => ({ table, el: el.value, settings: settings.value }),
);

defineExpose({ ctx });
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-data-table-bulk-actions">
    <Span v-bind="settings.count" class="f-data-table-bulk-actions-count">
      {{ selected.size }} selected
    </Span>
    <Button
      v-for="bulk in bulkActions"
      :key="bulk.label"
      v-bind="settings.action"
      class="f-data-table-bulk-action"
      @click="bulk.action(selected)"
    >
      <Icon v-bind="settings.actionIcon" :alias="bulk.icon" />
      {{ bulk.label }}
    </Button>
    <Button v-bind="settings.clear" class="f-data-table-bulk-action-clear">
      Clear
    </Button>
  </Group>
</template>
