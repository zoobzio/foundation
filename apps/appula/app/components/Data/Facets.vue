<script setup lang="ts">
import type { FacetableStore } from "@foundation/blocks/types/common";

const props = defineProps<{
  store: FacetableStore;
}>();

const open = defineModel<boolean>("open", { default: false });

const selectedFacets = computed({
  get: () => props.store.selectedFacets.value,
  set: (val) => { props.store.selectedFacets.value = val; },
});

const activeCount = computed(() => selectedFacets.value.size);
</script>

<template>
  <Popover v-model:open="open" align="end">
    <Fab icon="filter" label="Filters" :badge="activeCount > 0 ? activeCount : undefined" />
    <template #content>
      <Command
        v-model:selected="selectedFacets"
        :groups="store.facets.value"
        placeholder="Search filters..."
        multiple
        @keydown.escape="open = false"
      />
    </template>
  </Popover>
</template>
