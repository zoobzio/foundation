<script lang="ts">
import type {
  NavContext,
  NavProps,
  NavSlots,
} from "../../types/common/nav";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<NavProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"nav">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<NavContext>("nav", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<NavSlots>();
</script>

<template>
  <nav ref="el" class="f-nav" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </nav>
</template>
