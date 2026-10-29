<script lang="ts">
import type {
  FacetItem,
  FacetsContext,
  FacetsEmits,
  FacetsPassthrough,
  FacetsProps,
  FacetsSlots,
} from "../types/components/facets";
import type { CommandGroup } from "../types/components/command";
import type { ComponentPublicInstance } from "vue";

import Command from "./command.vue";
import Fab from "./fab.vue";
import Popover from "./popover.vue";

import Primitive from "./primitive.vue";

import { computed, useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";
import { FACETS_PLACEHOLDER, FACETS_TRIGGER_LABEL } from "../constants/filter";
</script>

<script setup lang="ts" generic="T extends FacetItem">
const {
  groups,
  selected,
  open = undefined,
  placeholder = FACETS_PLACEHOLDER,
  pt,
} = defineProps<FacetsProps<T>>();

const emit = defineEmits<FacetsEmits>();

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const activeCount = computed(() => selected?.size ?? 0);

const commandGroups = computed<CommandGroup<T>[]>(() =>
  groups.map((g) => ({
    key: g.key,
    label: g.label,
    options: g.items,
  })),
);

const selectedOptions = computed<T[]>(() => {
  const set = selected ?? new Set<string>();
  return commandGroups.value
    .flatMap((g) => g.options)
    .filter((o) => set.has(o.value));
});

const settings = usePassthrough<FacetsPassthrough<T>>(() => ({
  pt,
  recipes: {
    popover: {
      open: $open.value,
      align: "end",
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    trigger: {
      as: Fab,
      label: FACETS_TRIGGER_LABEL,
      badge: activeCount.value > 0 ? activeCount.value : undefined,
    },
    command: {
      as: Command,
      groups: commandGroups.value,
      modelValue: selectedOptions.value,
      multiple: true,
      placeholder,
      "onUpdate:modelValue": (v) => {
        emit("update:selected", new Set((v ?? []).map((o) => o.value)));
      },
    },
  },
}));

const ctx = useContext<FacetsContext<T>>("facets", () => ({
  groups,
  selected,
  open: $open,
  activeCount: activeCount.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<FacetsSlots<T>>();
</script>

<template>
  <Popover ref="el" v-bind="settings.popover">
    <template #trigger>
      <slot name="trigger" v-bind="ctx">
        <Primitive v-bind="settings.trigger" />
      </slot>
    </template>
    <template #content>
      <slot name="command" v-bind="ctx">
        <Primitive v-bind="settings.command" />
      </slot>
    </template>
  </Popover>
</template>
