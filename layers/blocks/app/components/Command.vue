<script setup lang="ts">
import type { CommandProps, CommandEmits } from "../types/command";

import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxContent,
  ComboboxViewport,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxItem,
  ComboboxEmpty,
} from "reka-ui";

const {
  groups,
  placeholder = "Search...",
  disabled,
  multiple = false,
} = defineProps<CommandProps>();

const emit = defineEmits<CommandEmits>();

const searchTerm = defineModel<string>("searchTerm", { default: "" });
const selected = defineModel<Set<string>>("selected", { default: () => new Set() });

// Sync Set <-> Array for Combobox v-model
const modelArray = computed({
  get: () => [...selected.value],
  set: (val: string[]) => {
    selected.value = new Set(val);
  },
});

const isSelected = (value: string) => selected.value.has(value);

// Filter groups: match Combobox filtering + hide items with count=0
const filteredGroups = computed(() => {
  const search = searchTerm.value.toLowerCase();
  const isSearching = search.length > 0;

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        // Match search term against label
        if (isSearching && !item.label.toLowerCase().includes(search)) return false;
        // When searching, hide items with count=0
        if (isSearching && item.count === 0) return false;
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);
});

// Single-select mode: emit select event
const handleSingleSelect = (value: string | string[]) => {
  if (multiple) return;
  const val = Array.isArray(value) ? value[0] : value;
  if (val) emit("select", val);
};
</script>

<template>
  <ComboboxRoot
    v-model="modelArray"
    v-model:search-term="searchTerm"
    :disabled="disabled"
    :multiple="multiple"
    :open="true"
    :display-value="() => ''"
    :reset-search-term-on-blur="false"
    class="f-command-root"
    @update:model-value="handleSingleSelect"
  >
    <ComboboxInput
      :placeholder="placeholder"
      class="f-command-input"
    />
    <ComboboxContent
      class="f-command-content"
      :dismissable="false"
    >
      <ComboboxViewport as-child>
        <Scroller class="f-command-viewport">
          <ComboboxEmpty class="f-command-empty">
            <slot name="empty">No results found</slot>
          </ComboboxEmpty>

          <ComboboxGroup
            v-for="group in filteredGroups"
            :key="group.key"
            class="f-command-group"
          >
            <ComboboxLabel v-if="group.label" as-child>
              <Caption>{{ group.label }}</Caption>
            </ComboboxLabel>
            <ComboboxItem
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
            </ComboboxItem>
          </ComboboxGroup>
        </Scroller>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>

