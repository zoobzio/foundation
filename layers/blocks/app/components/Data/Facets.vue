<script setup lang="ts">
import type { FacetGroup } from "../../types/common";

const props = defineProps<{
  groups: FacetGroup[];
}>();

const selected = defineModel<Set<string>>("selected", { default: () => new Set() });

const open = defineModel<boolean>("open", { default: false });

const activeCount = computed(() => selected.value.size);
</script>

<template>
  <Popover v-model:open="open" align="start">
    <Fab icon="filter" :badge="activeCount > 0 ? activeCount : undefined" />
    <template #content>
      <Command
        v-model:selected="selected"
        :groups="groups"
        placeholder="Search filters..."
        multiple
        @keydown.escape="open = false"
      />
    </template>
  </Popover>
</template>
