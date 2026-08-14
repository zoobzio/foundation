<script lang="ts">
import type {
  PreContext,
  PreProps,
  PreSlots,
} from "../../types/common/pre";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<PreProps>();

const el = useTemplateRef<HTMLPreElement>("el");

const bindings = useBindings<"pre">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<PreContext>("pre", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<PreSlots>();
</script>

<template>
  <pre ref="el" class="f-pre" v-bind="bindings"><slot v-bind="ctx">{{ label }}</slot></pre>
</template>
