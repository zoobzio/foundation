<script lang="ts">
import type { DataTableColumn } from "#foundation/types/data/table";
import type { DataTableFilterHelpProps } from "#foundation/types/data/table-filter-help";
</script>

<script setup lang="ts" generic="T">
import { computed, ref, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import type { IconAlias } from "#foundation/types/common/iconic";
import Dialog from "#foundation/components/core/Dialog.vue";
import Icon from "#foundation/components/common/icon.vue";
import Kbd from "#foundation/components/common/kbd.vue";
import Table from "#foundation/components/common/table.vue";
import Tbody from "#foundation/components/common/tbody.vue";
import Td from "#foundation/components/common/td.vue";
import Th from "#foundation/components/common/th.vue";
import Thead from "#foundation/components/common/thead.vue";
import Tr from "#foundation/components/common/tr.vue";
const { columns, pt } = defineProps<DataTableFilterHelpProps<T>>();

const el = useTemplateRef("el");
defineExpose({ el });

const open = ref(false);

const helpRows = computed(() => {
  const rows = [
    { syntax: '"your query here"', description: "Semantic search" },
    { syntax: "(+include -exclude)", description: "Keyword search (AND)" },
    { syntax: "(+term1 || +term2)", description: "Keyword search (OR)" },
  ];
  for (const col of columns as DataTableColumn<T>[]) {
    if (col.type === "enum" && col.enumValues) {
      rows.push({
        syntax: `${col.label}=${col.enumValues[0] ?? "value"}`,
        description: `Filter by ${col.label}`,
      });
    }
    if (col.type === "date" || col.type === "datetime") {
      rows.push({
        syntax: `${col.label}>2025-01-01`,
        description: `${col.label} after date`,
      });
      rows.push({
        syntax: `${col.label}<2025-01-01`,
        description: `${col.label} before date`,
      });
    }
  }
  return rows;
});

// Passthrough
const triggerPT = usePassthrough(pt?.trigger, {
  props: { alias: "info" as IconAlias },
  handlers: {},
});
const dialogPT = usePassthrough(pt?.dialog, () => ({
  props: {
    open: open.value,
    title: "Filter Shortcuts",
    description: "Use these shortcuts in the filter input",
  },
  handlers: {
    "update:open": (v: boolean) => {
      open.value = v;
    },
  },
}));
const tablePT = usePassthrough(pt?.table, { props: {}, handlers: {} });
const theadPT = usePassthrough(pt?.thead, { props: {}, handlers: {} });
const tbodyPT = usePassthrough(pt?.tbody, { props: {}, handlers: {} });
const thPT = usePassthrough(pt?.th, { props: {}, handlers: {} });
const tdPT = usePassthrough(pt?.td, { props: {}, handlers: {} });
const kbdPT = usePassthrough(pt?.kbd, { props: {}, handlers: {} });
</script>

<template>
  <Icon
    ref="el"
    v-bind="triggerPT.props"
    class="f-data-table-filters-info"
    v-on="triggerPT.handlers"
    @click="open = true"
  />
  <Dialog v-bind="dialogPT.props" v-on="dialogPT.handlers">
    <Table v-bind="tablePT.props" v-on="tablePT.handlers">
      <Thead v-bind="theadPT.props" v-on="theadPT.handlers">
        <Tr>
          <Th v-bind="thPT.props" v-on="thPT.handlers">Syntax</Th>
          <Th v-bind="thPT.props" v-on="thPT.handlers">Description</Th>
        </Tr>
      </Thead>
      <Tbody v-bind="tbodyPT.props" v-on="tbodyPT.handlers">
        <Tr v-for="row in helpRows" :key="row.syntax">
          <Td v-bind="tdPT.props" v-on="tdPT.handlers">
            <Kbd v-bind="kbdPT.props" v-on="kbdPT.handlers">{{
              row.syntax
            }}</Kbd>
          </Td>
          <Td v-bind="tdPT.props" v-on="tdPT.handlers">{{
            row.description
          }}</Td>
        </Tr>
      </Tbody>
    </Table>
  </Dialog>
</template>
