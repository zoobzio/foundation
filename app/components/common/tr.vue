<script lang="ts">
import type {
  TrBindings,
  TrContext,
  TrProps,
  TrSlots,
} from "#foundation/types/common/tr";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<TrProps>();

defineSlots<TrSlots>();

const el = useTemplateRef<HTMLTableRowElement>("el");

const bindings = computed<TrBindings>(() =>
  useBindings<"tr">(modifiers, tokens, aria),
);

const ctx = computed<TrContext>(() => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <tr ref="el" class="f-tr" v-bind="bindings">
    <slot :ctx="ctx" />
  </tr>
</template>
