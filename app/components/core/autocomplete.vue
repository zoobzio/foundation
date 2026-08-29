<script lang="ts">
import type {
  AutocompleteProps,
  AutocompleteEmits,
  AutocompletePassthrough,
  AutocompleteContext,
  AutocompleteSlots,
  AutocompleteOption,
} from "../../types/core/autocomplete";
import type { ComponentPublicInstance } from "vue";

import AutocompleteRoot from "../common/autocomplete/root.vue";
import AutocompleteInput from "../common/autocomplete/input.vue";
import AutocompleteContent from "../common/autocomplete/content.vue";
import AutocompleteItem from "../common/autocomplete/item.vue";
import Button from "../common/button.vue";
import Chip from "../common/chip.vue";
import Group from "../common/group.vue";
import Icon from "../common/icon.vue";
import Span from "../common/span.vue";
import Scroller from "./scroller.vue";

import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
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

// re-arms once the user scrolls away from the end, so `more` fires once per
// crossing instead of per scroll tick
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
    chip: (anchor) => ({
      label: anchor.option.label,
      onClick: () => {
        emit("unwind", anchor.index);
      },
    }),
    field: {},
    hint: { aria: { hidden: true } },
    hintText: {},
    hintChar: {},
    input: {
      placeholder,
      disabled,
      // an Enter reka did not claim for a highlighted item submits the text
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
    panel: {},
    scroller: {},
    item: (anchor) => ({
      value: anchor.option.value,
      disabled: anchor.option.disabled,
      textValue: anchor.option.label,
      onSelect: (event) => {
        // preventDefault blocks reka's own model write + close
        event.preventDefault();
        if (!anchor.option.disabled) emit("select", anchor.option);
      },
    }),
    trailItem: (anchor) => ({
      type: "button",
      disabled: anchor.option.disabled,
      aria: anchor.option.active ? { current: true } : {},
      onClick: () => {
        if (!anchor.option.disabled) emit("select", anchor.option);
      },
    }),
    itemIcon: (anchor) => ({
      alias: anchor.option.icon!,
    }),
    itemLabel: {},
    itemArrow: { alias: "chevron-right" },
    empty: {},
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
  <AutocompleteRoot ref="el" v-bind="settings.root">
    <slot name="chips" v-bind="ctx">
      <template v-for="(step, i) in steps" :key="step.value">
        <slot name="chip" v-bind="{ ...ctx, option: step, index: i }">
          <Chip v-bind="settings.chip({ option: step, index: i })" />
        </slot>
      </template>
    </slot>
    <Group v-bind="settings.field">
      <slot name="hint" v-bind="ctx">
        <Group v-show="hint" v-bind="settings.hint">
          <Span v-bind="settings.hintText">{{ $model }}</Span>
          <Span v-bind="settings.hintChar">{{ hint }}</Span>
        </Group>
      </slot>
      <slot name="input" v-bind="ctx">
        <AutocompleteInput v-bind="settings.input" />
      </slot>
      <AutocompleteContent
        v-if="panels.length || empty"
        v-bind="settings.content"
      >
      <Group
        v-for="(options, p) in panels"
        :key="p"
        v-bind="settings.panel"
      >
        <Scroller v-bind="settings.scroller">
          <template v-for="(option, i) in options" :key="option.value">
            <slot
              name="item"
              v-bind="{ ...ctx, option, index: i, panel: p }"
            >
              <component
                :is="p < trail.length ? Button : AutocompleteItem"
                v-bind="
                  p < trail.length
                    ? settings.trailItem({ option, index: i, panel: p })
                    : settings.item({ option, index: i, panel: p })
                "
              >
                <slot
                  name="itemIcon"
                  v-bind="{ ...ctx, option, index: i, panel: p }"
                >
                  <Icon
                    v-if="option.icon"
                    v-bind="settings.itemIcon({ option, index: i, panel: p })"
                  />
                </slot>
                <slot
                  name="itemLabel"
                  v-bind="{ ...ctx, option, index: i, panel: p }"
                >
                  <Span v-bind="settings.itemLabel">{{ option.label }}</Span>
                </slot>
                <slot
                  name="itemArrow"
                  v-bind="{ ...ctx, option, index: i, panel: p }"
                >
                  <Icon
                    v-if="option.hasChildren"
                    v-bind="settings.itemArrow"
                  />
                </slot>
              </component>
            </slot>
          </template>
        </Scroller>
      </Group>
      <slot name="empty" v-bind="ctx">
        <Group v-if="empty" v-bind="settings.panel">
          <Span v-bind="settings.empty">No matches</Span>
        </Group>
      </slot>
      </AutocompleteContent>
    </Group>
  </AutocompleteRoot>
</template>
