<script lang="ts">
import type {
  AutocompleteItemContext,
  AutocompleteItemPassthrough,
  AutocompleteItemProps,
  AutocompleteItemSlots,
} from "../../../types/data/autocomplete/item";
import type { ComponentPublicInstance } from "vue";

import Button from "../../common/button.vue";
import Icon from "../../common/icon.vue";
import Span from "../../common/span.vue";

import { useTemplateRef } from "#imports";
import { useAutocomplete } from "../../../composables/autocomplete";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts" generic="M">
const { autocomplete, item, index, panel, pt } =
  defineProps<AutocompleteItemProps<M>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const { useItem } = useAutocomplete(autocomplete);
const { locked, highlighted, recipes } = useItem(() => ({
  item,
  index,
  panel,
}));

const settings = usePassthrough<AutocompleteItemPassthrough>(() => ({
  pt,
  recipes: {
    icon: {},
    label: {},
    ...recipes.value,
  },
}));

const ctx = useContext<AutocompleteItemContext<M>>(
  "data-autocomplete-item",
  () => ({
    autocomplete,
    item,
    index,
    panel,
    locked: locked.value,
    highlighted: highlighted.value,
    el: el.value,
    settings: settings.value,
  }),
);

defineExpose({ ctx });
defineSlots<AutocompleteItemSlots<M>>();
</script>

<template>
  <Button
    ref="el"
    v-bind="settings.root"
    class="f-data-autocomplete-item"
    :class="{
      'f-data-autocomplete-item--highlighted': highlighted,
      'f-data-autocomplete-item--locked': locked,
      'f-data-autocomplete-item--disabled': item.disabled,
    }"
  >
    <slot v-if="item.icon" name="icon" v-bind="ctx">
      <Icon
        v-bind="settings.icon"
        :alias="item.icon"
        class="f-data-autocomplete-item-icon"
      />
    </slot>
    <slot name="label" v-bind="ctx">
      <Span v-bind="settings.label" class="f-data-autocomplete-item-label">
        {{ item.label }}
      </Span>
    </slot>
    <slot v-if="item.hasChildren" name="arrow" v-bind="ctx">
      <Icon v-bind="settings.arrow" class="f-data-autocomplete-item-arrow" />
    </slot>
  </Button>
</template>
