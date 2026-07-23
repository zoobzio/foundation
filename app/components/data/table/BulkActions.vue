<script lang="ts">
import type { DataTableBulkActionsProps } from "#foundation/types/data/table-bulk-actions";
</script>

<script setup lang="ts" generic="T, K = unknown">
import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { passthrough } from "#foundation/utils/passthrough";
import Button from "#foundation/components/common/button.vue";
import Group from "#foundation/components/common/group.vue";
import Icon from "#foundation/components/common/icon.vue";
import Span from "#foundation/components/common/span.vue";
const { table, pt } = defineProps<DataTableBulkActionsProps<T, K>>();

const el = useTemplateRef("el");
defineExpose({ el });

const { bulkActions, selected, clearSelection } = table;

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const countPT = usePassthrough(pt?.count, { props: {}, handlers: {} });
const clearPT = usePassthrough(pt?.clear, { props: {}, handlers: {} });
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-table-bulk-actions"
    v-on="rootPT.handlers"
  >
    <Span
      v-bind="countPT.props"
      class="f-data-table-bulk-actions-count"
      v-on="countPT.handlers"
    >
      {{ selected.size }} selected
    </Span>
    <Button
      v-for="bulk in bulkActions"
      :key="bulk.label"
      v-bind="passthrough(pt?.action, { props: {}, handlers: {} }).props"
      class="f-data-table-bulk-action"
      @click="bulk.action(selected)"
    >
      <Icon
        v-bind="
          passthrough(pt?.actionIcon, {
            props: { alias: bulk.icon },
            handlers: {},
          }).props
        "
      />
      {{ bulk.label }}
    </Button>
    <Button
      v-bind="clearPT.props"
      class="f-data-table-bulk-action-clear"
      v-on="clearPT.handlers"
      @click="clearSelection()"
    >
      Clear
    </Button>
  </Group>
</template>
