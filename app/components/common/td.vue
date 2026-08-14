<script lang="ts">
import type {
  TdContext,
  TdProps,
  TdSlots,
} from "../../types/common/td";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<TdProps>();

const el = useTemplateRef<HTMLTableCellElement>("el");

const bindings = useBindings<"td">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<TdContext>("td", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TdSlots>();
</script>

<template>
  <td ref="el" class="f-td" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </td>
</template>
