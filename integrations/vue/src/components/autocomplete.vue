<script lang="ts">
import type {
  AutocompleteProps,
  AutocompleteEmits,
  AutocompletePassthrough,
  AutocompleteContext,
  AutocompleteSlots,
  AutocompleteMeasure,
  AutocompleteOptionContext,
} from "../types/components/autocomplete";
import type { ComponentPublicInstance, VNode } from "vue";

import {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteViewport,
  AutocompleteVirtualizer,
  AutocompleteItem,
} from "reka-ui";

import { computed, useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";

/**
 * Builds the `measure` ref of a virtualized row. The virtualizer measures
 * elements; a component ref resolves to its root element first.
 */
const measurer = (virtualizer: {
  measureElement: (el: Element | null) => void;
}): AutocompleteMeasure => {
  return (target) => {
    const el = target instanceof Element ? target : target?.$el;
    virtualizer.measureElement(el instanceof Element ? el : null);
  };
};
</script>

<script setup lang="ts">
const {
  service,
  empty = false,
  placeholder = "",
  disabled,
  open = undefined,
  pt,
} = defineProps<AutocompleteProps>();

const emit = defineEmits<AutocompleteEmits>();

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

/** The index of the active panel: the one after the trail. */
const depth = computed(() => service.trail.length);

const settings = usePassthrough<AutocompletePassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: service.draft,
      open: $open.value,
      disabled,
      ignoreFilter: true,
      openOnFocus: true,
      openOnClick: true,
      "onUpdate:modelValue": (v) => {
        service.setDraft(v);
      },
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    input: {
      placeholder,
      disabled,
      onKeydown: (event) => {
        if (
          event.key === "Backspace" &&
          !service.draft &&
          service.entries.length
        ) {
          event.preventDefault();
          service.unwrap();
          return;
        }
        if (event.key !== "Enter" || event.defaultPrevented) return;
        event.preventDefault();
        service.submit();
      },
    },
    content: {},
    viewport: {},
    virtualizer: {
      options: service.items,
      textContent: (option) => option.label,
    },
    item: (anchor) => ({
      value: anchor.option.value,
      textValue: anchor.option.label,
      onSelect: (event) => {
        event.preventDefault();
        service.select(anchor.option);
      },
    }),
  },
}));

const ctx = useContext<AutocompleteContext>("autocomplete", () => ({
  service,
  empty,
  placeholder,
  disabled,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
const slots = defineSlots<AutocompleteSlots>();

/**
 * The consumer's item as one vnode. The virtualizer positions a row by its
 * root, so the active panel renders the `item` slot through `component :is`
 * rather than a `<slot>`, whose fragment would hide the root from it.
 */
const row = (payload: AutocompleteOptionContext): VNode | undefined => {
  const nodes = slots.item?.(payload) ?? [];
  return nodes.find((node) => typeof node.type !== "symbol") ?? nodes[0];
};
</script>

<template>
  <AutocompleteRoot ref="el" class="f-autocomplete-root" v-bind="settings.root">
    <slot name="chips" v-bind="ctx">
      <template
        v-for="(entry, i) in service.entries"
        :key="service.textFor(entry)"
      >
        <slot name="chip" v-bind="{ ...ctx, entry, index: i }">
          <button type="button" class="f-chip" @click="service.remove(i)">
            {{ service.labelFor(entry) }}
          </button>
        </slot>
      </template>
    </slot>
    <div class="f-group">
      <slot name="hint" v-bind="ctx">
        <div v-show="service.hint" class="f-group" aria-hidden="true">
          <span class="f-span">{{ service.draft }}</span>
          <span class="f-span">{{ service.hint }}</span>
        </div>
      </slot>
      <slot name="input" v-bind="ctx">
        <AutocompleteInput
          class="f-autocomplete-input"
          v-bind="settings.input"
        />
      </slot>
      <AutocompleteContent
        v-if="service.panels.length || empty"
        class="f-autocomplete-content"
        v-bind="settings.content"
      >
        <div v-for="(options, p) in service.trail" :key="p" class="f-group">
          <template v-for="(option, i) in options" :key="option.value">
            <slot name="item" v-bind="{ ...ctx, option, index: i, panel: p }">
              <button
                type="button"
                class="f-button"
                :aria-current="option.active ? true : undefined"
                @click="service.select(option)"
              >
                <slot
                  name="itemPrepend"
                  v-bind="{ ...ctx, option, index: i, panel: p }"
                />
                <slot
                  name="itemLabel"
                  v-bind="{ ...ctx, option, index: i, panel: p }"
                >
                  <span class="f-span">{{ option.label }}</span>
                </slot>
                <slot
                  name="itemAppend"
                  v-bind="{ ...ctx, option, index: i, panel: p }"
                />
                <slot
                  name="itemArrow"
                  v-bind="{ ...ctx, option, index: i, panel: p }"
                />
              </button>
            </slot>
          </template>
        </div>
        <AutocompleteViewport
          v-if="service.items.length"
          class="f-autocomplete-viewport"
          v-bind="settings.viewport"
        >
          <AutocompleteVirtualizer
            v-slot="{ option, virtualItem, virtualizer }"
            v-bind="settings.virtualizer"
          >
            <component
              :is="
                row({
                  ...ctx,
                  option,
                  index: virtualItem.index,
                  panel: depth,
                  measure: measurer(virtualizer),
                })
              "
              v-if="$slots.item"
            />
            <AutocompleteItem
              v-else
              :ref="measurer(virtualizer)"
              class="f-autocomplete-item"
              v-bind="
                settings.item({
                  option,
                  index: virtualItem.index,
                  panel: depth,
                })
              "
            >
              <slot
                name="itemPrepend"
                v-bind="{
                  ...ctx,
                  option,
                  index: virtualItem.index,
                  panel: depth,
                }"
              />
              <slot
                name="itemLabel"
                v-bind="{
                  ...ctx,
                  option,
                  index: virtualItem.index,
                  panel: depth,
                }"
              >
                <span class="f-span">{{ option.label }}</span>
              </slot>
              <slot
                name="itemAppend"
                v-bind="{
                  ...ctx,
                  option,
                  index: virtualItem.index,
                  panel: depth,
                }"
              />
              <slot
                name="itemArrow"
                v-bind="{
                  ...ctx,
                  option,
                  index: virtualItem.index,
                  panel: depth,
                }"
              />
            </AutocompleteItem>
          </AutocompleteVirtualizer>
        </AutocompleteViewport>
        <slot name="empty" v-bind="ctx">
          <div v-if="empty" class="f-group">
            <span class="f-span">No matches</span>
          </div>
        </slot>
      </AutocompleteContent>
    </div>
  </AutocompleteRoot>
</template>
