<script lang="ts">
/**
 * A text input with stacked option panels: the `trail` panels, then `items`.
 * Only the last panel is a listbox. Trail panels render plain buttons so
 * keyboard navigation stays on the active panel. `more` emits once per
 * scroll to the end of a panel.
 */
import type {
  AutocompleteProps,
  AutocompleteEmits,
  AutocompletePassthrough,
  AutocompleteContext,
  AutocompleteSlots,
  AutocompleteOption,
} from "../types/core/autocomplete";
import type { ComponentPublicInstance } from "vue";

import {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from "reka-ui";
import Scroller from "./scroller.vue";

import { computed, useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";
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

const panels = computed(() => {
  const result: AutocompleteOption<M>[][] = [...trail];
  if (items.length) result.push(items);
  return result;
});

let moreArmed = true;
const onPanelScroll = (event: Event) => {
  const el = event.target;
  if (!(el instanceof HTMLElement)) return;
  const nearEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 48;
  if (nearEnd && moreArmed) {
    moreArmed = false;
    emit("more");
  } else if (!nearEnd) {
    moreArmed = true;
  }
};

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
      onKeydown: (event) => {
        if (event.key === "Backspace" && !$model.value && steps.length) {
          event.preventDefault();
          emit("unwrap");
          return;
        }
        if (event.key !== "Enter" || event.defaultPrevented) return;
        event.preventDefault();
        emit("submit", $model.value ?? "");
      },
    },
    content: { onScrollCapture: onPanelScroll },
    scroller: {},
    item: (anchor) => ({
      value: anchor.option.value,
      disabled: anchor.option.disabled,
      textValue: anchor.option.label,
      onSelect: (event) => {
        event.preventDefault();
        if (!anchor.option.disabled) emit("select", anchor.option);
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
                  @click="
                    () => {
                      if (!option.disabled) emit('select', option);
                    }
                  "
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
