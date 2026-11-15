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

import { computed, useTemplateRef, watch } from "vue";
import {
  AUTOCOMPLETE_EMPTY_TEXT,
  AUTOCOMPLETE_LOADING_TEXT,
  AUTOCOMPLETE_MORE_LEAD,
  AUTOCOMPLETE_MORE_TEXT,
} from "../constants/autocomplete";
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
 * The element that asks for more: it lies over the end of the active
 * panel's options, `AUTOCOMPLETE_MORE_LEAD` deep, so it comes into view
 * as the visitor nears the end, by scroll or by key, before the last
 * option does. Its height and its negative margin cancel, so it adds
 * nothing to the scroll.
 */
const sentinel = useTemplateRef<HTMLElement>("sentinel");

const lead = {
  height: AUTOCOMPLETE_MORE_LEAD,
  marginTop: `-${AUTOCOMPLETE_MORE_LEAD}`,
  pointerEvents: "none",
} as const;

/**
 * Asks the service for more while the sentinel is in view. An observer
 * reports a change alone, and a page that leaves the sentinel in view
 * changes nothing, so each settled lookup observes afresh: the new
 * observer reports where the sentinel stands, and a page too short to
 * fill the viewport is followed by the next. In view means on screen, so
 * a viewport no height bounds stops once its options run off the page.
 */
watch(
  [sentinel, () => service.suggest],
  ([target, suggest], _, onCleanup) => {
    if (!target || suggest.status !== "idle" || !suggest.more) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) service.more();
    });
    observer.observe(target);
    onCleanup(() => observer.disconnect());
  },
  { flush: "post" },
);

/**
 * The index of the active panel: the one after the trail. Also the count of
 * groups with an option set, so a depth of zero is the first panel.
 */
const depth = computed(() => service.trail.length);

/**
 * Whether the content renders: the panels, or the empty state while the
 * draft is at a stage that suggests. A literal is terminal, so its stage
 * shows nothing, not even the empty state.
 */
const shown = computed(
  () => service.panels.length > 0 || (empty && service.stage !== "literal"),
);

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
        v-if="shown"
        class="f-autocomplete-content"
        :aria-busy="service.suggest.status !== 'idle' || undefined"
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
          that element, which scrolls them once a height bounds it. The
          sentinel renders there alone: only a values provider has more to
          give, and its options are never the first panel's.
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
                <!--
                  The size of the set is unknown while a provider has more
                  to give. Reka's item memoizes its element, so an item
                  keeps the size it first rendered with: unknown stays
                  true of it as pages land, where a count would go stale.
                -->
                <AutocompleteItem
                  class="f-autocomplete-item"
                  v-bind="
                    settings.item({
                      option,
                      index: virtualItem.index,
                      panel: depth,
                    })
                  "
                  :aria-setsize="
                    service.suggest.more ? -1 : service.items.length
                  "
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
          <div
            v-if="service.suggest.more"
            ref="sentinel"
            class="f-autocomplete-sentinel"
            aria-hidden="true"
            :style="lead"
          />
        </component>
        <template v-if="service.suggest.status === 'extending'">
          <slot name="more" v-bind="ctx">
            <div class="f-group" role="status">
              <span class="f-span">{{ AUTOCOMPLETE_MORE_TEXT }}</span>
            </div>
          </slot>
        </template>
        <template v-if="!service.items.length">
          <template v-if="service.suggest.status === 'loading'">
            <slot name="loading" v-bind="ctx">
              <div class="f-group" role="status">
                <span class="f-span">{{ AUTOCOMPLETE_LOADING_TEXT }}</span>
              </div>
            </slot>
          </template>
          <slot v-else name="empty" v-bind="ctx">
            <div v-if="empty" class="f-group">
              <span class="f-span">{{ AUTOCOMPLETE_EMPTY_TEXT }}</span>
            </div>
          </slot>
        </template>
      </AutocompleteContent>
    </div>
  </AutocompleteRoot>
</template>
