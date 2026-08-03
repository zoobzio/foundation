<script lang="ts">
import type {
  FacetsContext,
  FacetsEmits,
  FacetsPassthrough,
  FacetsProps,
  FacetsSlots,
} from "#foundation/types/core/facets";
import type {
  CommandGroup,
  CommandOption,
} from "#foundation/types/core/command";
import type { ComponentPublicInstance } from "vue";

import Command from "#foundation/components/core/command.vue";
import Fab from "#foundation/components/core/fab.vue";
import Popover from "#foundation/components/core/popover.vue";

import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
import {
  FACETS_PLACEHOLDER,
  FACETS_TRIGGER_ICON,
} from "#foundation/constants/facets";
</script>

<script setup lang="ts">
const {
  groups,
  selected,
  open = undefined,
  placeholder = FACETS_PLACEHOLDER,
  pt,
} = defineProps<FacetsProps>();

const emit = defineEmits<FacetsEmits>();

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const activeCount = computed(() => selected?.size ?? 0);

// FacetGroup → CommandGroup: the command speaks Options with counts.
const commandGroups = computed<CommandGroup<CommandOption>[]>(() =>
  groups.map((g) => ({
    key: g.key,
    label: g.label,
    options: g.items.map((i) => ({
      value: i.value,
      label: i.label,
      count: i.count,
    })),
  })),
);

// The command's model is the option objects; reconstruct them from the
// selected value set on the way in, collapse back to a Set on the way out.
const selectedOptions = computed<CommandOption[]>(() => {
  const set = selected ?? new Set<string>();
  return commandGroups.value
    .flatMap((g) => g.options)
    .filter((o) => set.has(o.value));
});

const settings = usePassthrough<FacetsPassthrough>(() => ({
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
      icon: FACETS_TRIGGER_ICON,
      badge: activeCount.value > 0 ? activeCount.value : undefined,
    },
    command: {
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

const ctx = useContext<FacetsContext>("facets", () => ({
  groups,
  selected,
  open: $open,
  activeCount: activeCount.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<FacetsSlots>();
</script>

<template>
  <Popover ref="el" v-bind="settings.popover">
    <template #trigger>
      <slot name="trigger" v-bind="ctx">
        <Fab v-bind="settings.trigger" />
      </slot>
    </template>
    <template #content>
      <slot name="command" v-bind="ctx">
        <Command v-bind="settings.command" />
      </slot>
    </template>
  </Popover>
</template>
