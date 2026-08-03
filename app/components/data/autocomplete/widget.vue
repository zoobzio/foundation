<script lang="ts">
import type {
  AutocompleteWidgetContext,
  AutocompleteWidgetEmits,
  AutocompleteWidgetPassthrough,
  AutocompleteWidgetProps,
  AutocompleteWidgetSlots,
} from "#foundation/types/data/autocomplete/widget";
import type { Events } from "#foundation/types/data/autocomplete";
import type { ComponentPublicInstance } from "vue";

import Group from "#foundation/components/common/group.vue";
import Input from "#foundation/components/common/input.vue";
import Item from "#foundation/components/data/autocomplete/item.vue";
import Scroller from "#foundation/components/core/scroller.vue";
import Span from "#foundation/components/common/span.vue";

import { ClientOnly } from "#components";
import { useTemplateRef } from "#imports";
import { useAutocomplete } from "#foundation/composables/autocomplete";
import { useHooks } from "#foundation/composables/hook";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import { useForwardSlots } from "#foundation/composables/slots";
import { AUTOCOMPLETE_ITEM_SLOTS } from "#foundation/constants/autocomplete";
</script>

<script setup lang="ts" generic="M">
const { autocomplete, pt } = defineProps<AutocompleteWidgetProps<M>>();

const emit = defineEmits<AutocompleteWidgetEmits<M>>();

useHooks<Events<M>>(autocomplete.id, {
  "autocomplete:updated": (event) => emit("updated", event),
  "autocomplete:selected": (event) => emit("selected", event),
  "autocomplete:submitted": (event) => emit("submitted", event),
  "autocomplete:unwound": (event) => emit("unwound", event),
});

const { input, hint, panels, dropdown, empty } = autocomplete;

const el = useTemplateRef<ComponentPublicInstance>("el");

const { recipes } = useAutocomplete(autocomplete, el);

const settings = usePassthrough<AutocompleteWidgetPassthrough<M>>(() => ({
  pt,
  recipes: {
    root: {},
    hint: {},
    hintText: {},
    hintChar: {},
    dropdown: {},
    panel: {},
    scroller: {},
    item: (anchor) => ({
      autocomplete,
      ...anchor,
    }),
    empty: {},
    ...recipes.value,
  },
}));

const ctx = useContext<AutocompleteWidgetContext<M>>("data-autocomplete", () => ({
  autocomplete,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<AutocompleteWidgetSlots<M>>();
const forwarded = useForwardSlots(slots, AUTOCOMPLETE_ITEM_SLOTS);
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-data-autocomplete">
    <slot name="hint" v-bind="ctx">
      <ClientOnly>
        <Group
          v-show="hint"
          v-bind="settings.hint"
          class="f-data-autocomplete-hint"
          aria-hidden="true"
        >
          <Span v-bind="settings.hintText" class="f-data-autocomplete-hint-text">
            {{ input }}
          </Span>
          <Span v-bind="settings.hintChar" class="f-data-autocomplete-hint-char">
            {{ hint }}
          </Span>
        </Group>
      </ClientOnly>
    </slot>
    <slot name="input" v-bind="ctx">
      <Input
        v-bind="settings.input"
        :class="[
          'f-data-autocomplete-input',
          { 'f-data-autocomplete-input--ghost': hint },
        ]"
      />
    </slot>
    <Group
      v-if="dropdown"
      v-bind="settings.dropdown"
      class="f-data-autocomplete-dropdown"
    >
      <Group
        v-for="(items, p) in panels"
        :key="p"
        v-bind="settings.panel"
        class="f-data-autocomplete-panel"
      >
        <Scroller v-bind="settings.scroller" class="f-data-autocomplete-scroller">
          <template #content>
            <Item
              v-for="(item, i) in items"
              :key="item.value"
              v-bind="settings.item({ item, index: i, panel: p })"
            >
              <template
                v-for="name in forwarded"
                :key="name"
                #[name]="slotProps"
              >
                <slot :name="name" v-bind="slotProps" />
              </template>
            </Item>
          </template>
        </Scroller>
      </Group>
      <slot name="empty" v-bind="ctx">
        <Group
          v-if="empty"
          v-bind="settings.panel"
          class="f-data-autocomplete-panel"
        >
          <Span v-bind="settings.empty" class="f-data-autocomplete-empty">
            No matches
          </Span>
        </Group>
      </slot>
    </Group>
  </Group>
</template>
