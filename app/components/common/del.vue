<script lang="ts">
import type {
  DelContext,
  DelProps,
  DelSlots,
} from "#foundation/types/common/del";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<DelProps>();

const el = useTemplateRef<HTMLModElement>("el");

const bindings = useBindings<"del">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<DelContext>("del", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DelSlots>();
</script>

<template>
  <del ref="el" class="f-del" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </del>
</template>
