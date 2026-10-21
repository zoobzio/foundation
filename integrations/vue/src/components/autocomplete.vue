<script lang="ts">
import type {
  AutocompleteProps,
  AutocompleteEmits,
  AutocompletePassthrough,
  AutocompleteContext,
  AutocompleteSlots,
} from "../types/components/autocomplete";
import type { ComponentPublicInstance } from "vue";

import {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from "reka-ui";
import Scroller from "./scroller.vue";

import { useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";
import { useAutocomplete } from "../composables/autocomplete";
</script>

<script setup lang="ts" generic="M">
const {
  items,
  steps = [],
  trail = [],
  modelValue,
  hint = "",
  empty = false,
  placeholder = "",
  disabled,
  open = undefined,
  pt,
} = defineProps<AutocompleteProps<M>>();

const emit = defineEmits<AutocompleteEmits<M>>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const { panels, select, onInputKeydown, onPanelScroll } = useAutocomplete(
  $model,
  () => ({ items, trail, steps }),
  emit,
);

const settings = usePassthrough<AutocompletePassthrough<M>>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      open: $open.value,
      disabled,
      ignoreFilter: true,
      openOnFocus: true,
      openOnClick: true,
      "onUpdate:modelValue": (v) => {
        $model.value = v;
      },
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    input: {
      placeholder,
      disabled,
      onKeydown: onInputKeydown,
    },
    content: { onScrollCapture: onPanelScroll },
    scroller: {},
    item: (anchor) => ({
      value: anchor.option.value,
      disabled: anchor.option.disabled,
      textValue: anchor.option.label,
      onSelect: (event) => {
        // preventDefault blocks reka's own model write + close
        event.preventDefault();
        select(anchor.option);
      },
    }),
  },
}));

const ctx = useContext<AutocompleteContext<M>>("autocomplete", () => ({
  items,
  steps,
  trail,
  hint,
  empty,
  placeholder,
  disabled,
  modelValue: $model,
  open: $open,
  panels: panels.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<AutocompleteSlots<M>>();
</script>

<template>
  <AutocompleteRoot ref="el" class="f-autocomplete-root" v-bind="settings.root">
    <slot name="chips" v-bind="ctx">
      <template v-for="(step, i) in steps" :key="step.value">
        <slot name="chip" v-bind="{ ...ctx, option: step, index: i }">
          <button type="button" class="f-chip" @click="emit('unwind', i)">
            {{ step.label }}
          </button>
        </slot>
      </template>
    </slot>
    <div class="f-group">
      <slot name="hint" v-bind="ctx">
        <div v-show="hint" class="f-group" aria-hidden="true">
          <span class="f-span">{{ $model }}</span>
          <span class="f-span">{{ hint }}</span>
        </div>
      </slot>
      <slot name="input" v-bind="ctx">
        <AutocompleteInput
          class="f-autocomplete-input"
          v-bind="settings.input"
        />
      </slot>
      <AutocompleteContent
        v-if="panels.length || empty"
        class="f-autocomplete-content"
        v-bind="settings.content"
      >
        <div v-for="(options, p) in panels" :key="p" class="f-group">
          <Scroller v-bind="settings.scroller">
            <template v-for="(option, i) in options" :key="option.value">
              <slot name="item" v-bind="{ ...ctx, option, index: i, panel: p }">
                <button
                  v-if="p < trail.length"
                  type="button"
                  class="f-button"
                  :disabled="option.disabled"
                  :aria-current="option.active ? true : undefined"
                  @click="select(option)"
                >
                  <slot
                    name="itemIcon"
                    v-bind="{ ...ctx, option, index: i, panel: p }"
                  />
                  <slot
                    name="itemLabel"
                    v-bind="{ ...ctx, option, index: i, panel: p }"
                  >
                    <span class="f-span">{{ option.label }}</span>
                  </slot>
                  <slot
                    name="itemArrow"
                    v-bind="{ ...ctx, option, index: i, panel: p }"
                  />
                </button>
                <AutocompleteItem
                  v-else
                  class="f-autocomplete-item"
                  v-bind="settings.item({ option, index: i, panel: p })"
                >
                  <slot
                    name="itemIcon"
                    v-bind="{ ...ctx, option, index: i, panel: p }"
                  />
                  <slot
                    name="itemLabel"
                    v-bind="{ ...ctx, option, index: i, panel: p }"
                  >
                    <span class="f-span">{{ option.label }}</span>
                  </slot>
                  <slot
                    name="itemArrow"
                    v-bind="{ ...ctx, option, index: i, panel: p }"
                  />
                </AutocompleteItem>
              </slot>
            </template>
          </Scroller>
        </div>
        <slot name="empty" v-bind="ctx">
          <div v-if="empty" class="f-group">
            <span class="f-span">No matches</span>
          </div>
        </slot>
      </AutocompleteContent>
    </div>
  </AutocompleteRoot>
</template>
