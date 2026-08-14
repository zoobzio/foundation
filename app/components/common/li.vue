<script lang="ts">
import type {
  LiContext,
  LiProps,
  LiSlots,
} from "../../types/common/li";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<LiProps>();

const el = useTemplateRef<HTMLLIElement>("el");

const bindings = useBindings<"li">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<LiContext>("li", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<LiSlots>();
</script>

<template>
  <li ref="el" class="f-li" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </li>
</template>
