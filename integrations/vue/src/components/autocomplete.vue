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
    scroller: {},
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
        <div v-for="(options, p) in service.panels" :key="p" class="f-group">
          <Scroller v-bind="settings.scroller">
            <template v-for="(option, i) in options" :key="option.value">
              <slot name="item" v-bind="{ ...ctx, option, index: i, panel: p }">
                <button
                  v-if="p < service.trail.length"
                  type="button"
                  class="f-button"
                  :aria-current="option.active ? true : undefined"
                  @click="service.select(option)"
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
