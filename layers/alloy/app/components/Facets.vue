<script lang="ts">
import type { FacetsProps } from "../types/facets";
</script>

<script setup lang="ts">
const { groups } = defineProps<FacetsProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const selected = defineModel<Set<string>>("selected", { default: () => new Set() });
const open = ref(false);
const activeCount = computed(() => selected.value.size);

const ctx = computed(() => ({ groups, selected: selected.value, activeCount: activeCount.value }));
</script>

<template>
  <Popover v-model:open="open" align="start">
    <slot name="trigger" v-bind="ctx">
      <Fab icon="filter" :badge="activeCount > 0 ? activeCount : undefined" />
    </slot>
    <template #content>
      <slot v-bind="ctx">
        <Command
          v-model:selected="selected"
          :groups="groups"
          placeholder="Search filters..."
          multiple
          @keydown.escape="open = false"
        />
      </slot>
    </template>
  </Popover>
</template>
