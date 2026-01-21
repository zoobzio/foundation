<script lang="ts">
import type { table, thead, tbody, tr, th, td } from "../../elements.config";

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  tokens?: Tokens<typeof table.key | typeof thead.key | typeof tbody.key | typeof tr.key | typeof th.key | typeof td.key>;
}
</script>

<script setup lang="ts" generic="T">
const { columns, data, tokens } = defineProps<DataTableProps<T>>();
</script>

<template>
  <Table :tokens="tokens">
    <Thead v-if="columns" :tokens="tokens">
      <Tr :tokens="tokens">
        <Th v-for="col in columns" :key="col.key" :tokens="tokens">
          <slot name="header" :column="col">
            {{ col.label }}
          </slot>
        </Th>
      </Tr>
    </Thead>
    <slot name="thead" />
    <Tbody v-if="data" :tokens="tokens">
      <Tr v-for="(row, rowIndex) in data" :key="rowIndex" :tokens="tokens">
        <Td v-for="col in columns" :key="col.key" :tokens="tokens">
          <slot name="cell" :row="row" :column="col" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>
        </Td>
      </Tr>
    </Tbody>
    <slot name="tbody" />
    <slot />
  </Table>
</template>
