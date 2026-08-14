<script lang="ts">
import type {
  MainContext,
  MainProps,
  MainSlots,
} from "../../types/common/main";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<MainProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"main">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<MainContext>("main", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<MainSlots>();
</script>

<template>
  <main ref="el" class="f-main" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </main>
</template>
