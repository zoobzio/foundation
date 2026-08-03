<script lang="ts">
import type {
  AsideContext,
  AsideProps,
  AsideSlots,
} from "#foundation/types/common/aside";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<AsideProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"aside">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<AsideContext>("aside", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AsideSlots>();
</script>

<template>
  <aside ref="el" class="f-aside" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </aside>
</template>
