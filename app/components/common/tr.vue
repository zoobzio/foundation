<script lang="ts">
import type {
  TrContext,
  TrProps,
  TrSlots,
} from "#foundation/types/common/tr";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<TrProps>();

const el = useTemplateRef<HTMLTableRowElement>("el");

const bindings = useBindings<"tr">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<TrContext>("tr", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TrSlots>();
</script>

<template>
  <tr ref="el" class="f-tr" v-bind="bindings">
    <slot v-bind="ctx" />
  </tr>
</template>
