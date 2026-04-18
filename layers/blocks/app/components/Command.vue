<script setup lang="ts">
import type { CommandProps, CommandEmits } from "../types/command";

import {
  ListboxRoot,
  ListboxFilter,
  ListboxContent,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
} from "reka-ui";

const {
  groups,
  placeholder = "Search...",
  disabled,
  multiple = false,
  filtered = false,
} = defineProps<CommandProps>();

const emit = defineEmits<CommandEmits>();

const searchTerm = defineModel<string>("searchTerm", { default: "" });
const selected = defineModel<Set<string>>("selected", { default: () => new Set() });

// Sync Set <-> Array for Listbox v-model
const modelArray = computed({
  get: () => [...selected.value],
  set: (val: string[]) => {
    selected.value = new Set(val);
  },
});

const isSelected = (value: string) => selected.value.has(value);

// Filter groups: match search term + hide items with count=0
// Skip when `filtered` — the parent already performed external search.
const filteredGroups = computed(() => {
  if (filtered) return groups.filter((g) => g.items.length > 0);

  const search = searchTerm.value.toLowerCase();
  const isSearching = search.length > 0;

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (isSearching && !item.label.toLowerCase().includes(search)) return false;
        if (isSearching && item.count === 0) return false;
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);
});

const hasResults = computed(() => filteredGroups.value.length > 0);

// Single-select mode: emit select event
const handleSingleSelect = (value: string | string[]) => {
  if (multiple) return;
  const val = Array.isArray(value) ? value[0] : value;
  if (val) emit("select", val);
};
</script>

<template>
  <ListboxRoot
    v-model="modelArray"
    :disabled="disabled"
    :multiple="multiple"
    class="f-command-root"
    @update:model-value="handleSingleSelect"
  >
    <div class="f-command-input-wrapper">
      <slot name="input-icon" />
      <ListboxFilter
        v-model="searchTerm"
        :placeholder="placeholder"
        auto-focus
        class="f-command-input"
      />
    </div>
    <ListboxContent class="f-command-content">
      <Scroller class="f-command-viewport">
        <div v-if="!hasResults" class="f-command-empty">
          <slot name="empty">No results found</slot>
        </div>

        <ListboxGroup
          v-for="group in filteredGroups"
          :key="group.key"
          class="f-command-group"
        >
          <ListboxGroupLabel v-if="group.label" as-child>
            <Caption>
              <slot name="group-label" :group="group">{{ group.label }}</slot>
            </Caption>
          </ListboxGroupLabel>
          <ListboxItem
            v-for="item in group.items"
            :key="item.value"
            :value="item.value"
            :disabled="item.disabled"
            class="f-command-item"
          >
            <slot name="item" :item="item" :selected="isSelected(item.value)">
              <Checkbox v-if="multiple" :model-value="isSelected(item.value)" />
              <span class="f-command-item-label">{{ item.label }}</span>
              <Kbd v-if="item.count !== undefined" class="f-command-item-count">{{ item.count }}</Kbd>
            </slot>
          </ListboxItem>
        </ListboxGroup>
      </Scroller>
    </ListboxContent>
  </ListboxRoot>
</template>
