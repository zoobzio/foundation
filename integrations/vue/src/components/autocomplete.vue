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
  AutocompleteVirtualizer,
  AutocompleteItem,
} from "reka-ui";
import Scroller from "./scroller.vue";
import Primitive from "./primitive.vue";

import { computed, useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";

/**
 * Builds the function ref of a virtualized row. The virtualizer measures
 * elements; a template ref may also hand a component instance or `null`.
 */
const measurer = (virtualizer: {
  measureElement: (el: Element | null) => void;
}) => {
  return (target: Element | ComponentPublicInstance | null) => {
    virtualizer.measureElement(target instanceof Element ? target : null);
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

/**
 * The index of the active panel: the one after the trail. Also the count of
 * groups with an option set, so a depth of zero is the first panel.
 */
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
    viewport: { as: Scroller, pt: { viewport: { asChild: true } } },
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
defineSlots<AutocompleteSlots>();
</script>

<template>
  <AutocompleteRoot ref="el" class="f-autocomplete-root" v-bind="settings.root">
    <slot name="inputPrepend" v-bind="ctx" />
    <slot name="chips" v-bind="ctx">
      <template
        v-for="(entry, i) in service.entries"
        :key="service.textFor(entry)"
      >
        <slot name="chip" v-bind="{ ...ctx, entry, index: i }">
          <button type="button" class="f-chip" @click="service.remove(i)">
            <slot name="chipPrepend" v-bind="{ ...ctx, entry, index: i }" />
            {{ service.labelFor(entry) }}
            <slot name="chipAppend" v-bind="{ ...ctx, entry, index: i }" />
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
      <slot name="inputAppend" v-bind="ctx" />
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
        <!--
          The scroller scrolls the first panel, the one open before any
          selection. Once a group has an option set, the active panel
          renders in a plain element with no scroller, so the viewport pt
          does not apply. The virtualizer still windows its options within
          that element, which scrolls them once a height bounds it.
        -->
        <component
          :is="depth ? 'div' : Primitive"
          v-if="service.items.length"
          class="f-autocomplete-viewport"
          v-bind="depth ? {} : settings.viewport"
        >
          <AutocompleteVirtualizer
            v-slot="{ option, virtualItem, virtualizer }"
            v-bind="settings.virtualizer"
          >
            <!--
              The virtualizer positions the row by its root and reka's item
              memoizes its element on its own state, so a moved item would
              keep a stale position. This row is a plain element the
              component owns: it takes the position and the measurement,
              and the item renders within it. It spans the viewport, as the
              virtualizer places it absolutely.
            -->
            <div
              :ref="measurer(virtualizer)"
              class="f-autocomplete-row"
              style="width: 100%"
            >
              <slot
                name="item"
                v-bind="{
                  ...ctx,
                  option,
                  index: virtualItem.index,
                  panel: depth,
                }"
              >
                <AutocompleteItem
                  class="f-autocomplete-item"
                  v-bind="
                    settings.item({
                      option,
                      index: virtualItem.index,
                      panel: depth,
                    })
                  "
                  :aria-setsize="service.items.length"
                  :aria-posinset="virtualItem.index + 1"
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
              </slot>
            </div>
          </AutocompleteVirtualizer>
        </component>
        <slot name="empty" v-bind="ctx">
          <div v-if="empty" class="f-group">
            <span class="f-span">No matches</span>
          </div>
        </slot>
      </AutocompleteContent>
    </div>
  </AutocompleteRoot>
</template>
