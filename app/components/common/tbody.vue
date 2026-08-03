<script lang="ts">
import type {
  TbodyContext,
  TbodyProps,
  TbodySlots,
} from "#foundation/types/common/tbody";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<TbodyProps>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const bindings = useBindings<"tbody">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<TbodyContext>("tbody", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TbodySlots>();
</script>

<template>
  <tbody ref="el" class="f-tbody" v-bind="bindings">
    <slot v-bind="ctx" />
  </tbody>
</template>
