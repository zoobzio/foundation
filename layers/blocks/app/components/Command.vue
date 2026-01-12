<script setup lang="ts">
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
  tokens,
} = defineProps<CommandProps>();

const emit = defineEmits<CommandEmits>();

const searchTerm = defineModel<string>("searchTerm", { default: "" });

const styles = useTokenStyle(tokens);

const handleSelect = (ev: CustomEvent) => {
  const value = ev.detail?.value;
  if (value) {
    emit("select", value);
  }
};
</script>

<template>
  <ComboboxRoot
    v-model:search-term="searchTerm"
    :disabled="disabled"
    :open="true"
    :ignore-filter="true"
    :style="styles['command-root']"
    class="f-command-root"
    @update:model-value="handleSelect"
  >
    <ComboboxInput
      :placeholder="placeholder"
      :style="styles['command-input']"
      class="f-command-input"
    />
    <ComboboxContent
      :style="styles['command-content']"
      class="f-command-content"
      :dismissable="false"
    >
      <ComboboxViewport
        :style="styles['command-viewport']"
        class="f-command-viewport"
      >
        <ComboboxEmpty
          :style="styles['command-empty']"
          class="f-command-empty"
        >
          <slot name="empty">No results found</slot>
        </ComboboxEmpty>

        <ComboboxGroup
          v-for="group in groups"
          :key="group.key"
          :style="styles['command-group']"
          class="f-command-group"
        >
          <ComboboxLabel
            v-if="group.label"
            :style="styles['command-label']"
            class="f-command-label"
          >
            {{ group.label }}
          </ComboboxLabel>
          <ComboboxItem
            v-for="item in group.items"
            :key="item.value"
            :value="item.value"
            :disabled="item.disabled"
            :style="styles['command-item']"
            class="f-command-item"
          >
            <slot name="item" :item="item">
              {{ item.label }}
            </slot>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>

<style>
@import "#build/untheme/command-root.css";
@import "#build/untheme/command-input.css";
@import "#build/untheme/command-content.css";
@import "#build/untheme/command-viewport.css";
@import "#build/untheme/command-group.css";
@import "#build/untheme/command-label.css";
@import "#build/untheme/command-item.css";
@import "#build/untheme/command-empty.css";
</style>
