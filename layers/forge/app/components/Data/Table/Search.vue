<script lang="ts">
import type { DataTableSearchProps } from "../../../types/data-table-search";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { table, pt } = defineProps<DataTableSearchProps<T, K>>();

const el = useTemplateRef("el");
defineExpose({ el });

const { query, page, fetch: fetchData } = table;

const open = ref(false);
const input = ref("");
const hasQuery = computed(() => !!query.value);

watch(open, (v) => {
  if (v) input.value = query.value;
});

const debounce = ref<ReturnType<typeof setTimeout> | null>(null);

watch(input, (val) => {
  if (debounce.value) clearTimeout(debounce.value);
  debounce.value = setTimeout(() => {
    query.value = val;
    page.value = 1;
    fetchData();
  }, 300);
});

// Passthrough
const popoverPT = usePassthrough(pt?.popover, () => ({
  props: { open: open.value, align: "end" as const },
  handlers: {
    "update:open": (v: boolean) => {
      open.value = v;
    },
  },
}));
const triggerPT = usePassthrough(pt?.trigger, () => ({
  props: {
    icon: "search" as IconAlias,
    badge: hasQuery.value ? "" : undefined,
  },
  handlers: {},
}));
const wrapPT = usePassthrough(pt?.wrap, {
  props: {},
  handlers: {},
});
const inputPT = usePassthrough(pt?.input, {
  props: { placeholder: "Search..." },
  handlers: {},
});
</script>

<template>
  <Popover ref="el" v-bind="popoverPT.props" v-on="popoverPT.handlers">
    <template #trigger>
      <Fab v-bind="triggerPT.props" v-on="triggerPT.handlers" />
    </template>
    <template #content>
      <Group
        v-bind="wrapPT.props"
        class="f-data-table-search"
        v-on="wrapPT.handlers"
      >
        <Input
          v-bind="inputPT.props"
          :value="input"
          class="f-command-input"
          @input="input = ($event.target as HTMLInputElement).value"
          @keydown.escape="open = false"
        />
      </Group>
    </template>
  </Popover>
</template>
