<script lang="ts">
import type {
  TdBindings,
  TdContext,
  TdProps,
  TdSlots,
} from "#foundation/types/common/td";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<TdProps>();

defineSlots<TdSlots>();

const el = useTemplateRef<HTMLTableCellElement>("el");

const bindings = computed<TdBindings>(() =>
  useBindings<"td">(modifiers, tokens, aria),
);

const ctx = computed<TdContext>(() => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <td ref="el" class="f-td" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </td>
</template>
