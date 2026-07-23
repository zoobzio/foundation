<script lang="ts">
import type {
  TbodyBindings,
  TbodyContext,
  TbodyProps,
  TbodySlots,
} from "#foundation/types/common/tbody";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<TbodyProps>();

defineSlots<TbodySlots>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const bindings = computed<TbodyBindings>(() =>
  useBindings<"tbody">(modifiers, tokens, aria),
);

const ctx = computed<TbodyContext>(() => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <tbody ref="el" class="f-tbody" v-bind="bindings">
    <slot :ctx="ctx" />
  </tbody>
</template>
