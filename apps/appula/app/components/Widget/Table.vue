<script setup lang="ts">
defineProps<{
  title: string;
  columns: { key: string; label: string }[];
  rows: Record<string, unknown>[];
}>();
</script>

<template>
  <DataWidget :title="title">
    <Table>
      <Thead>
        <Tr>
          <Th v-for="col in columns" :key="col.key">{{ col.label }}</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr v-for="(row, i) in rows" :key="i">
          <Td v-for="col in columns" :key="col.key">{{ row[col.key] }}</Td>
        </Tr>
      </Tbody>
    </Table>
  </DataWidget>
</template>
