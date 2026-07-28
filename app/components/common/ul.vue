<script lang="ts">
import type {
  UlContext,
  UlProps,
  UlSlots,
} from "#foundation/types/common/ul";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<UlProps>();

const el = useTemplateRef<HTMLUListElement>("el");

const bindings = useBindings<"ul">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<UlContext>("ul", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<UlSlots>();
</script>

<template>
  <ul ref="el" class="f-ul" v-bind="bindings">
    <slot v-bind="ctx" />
  </ul>
</template>
