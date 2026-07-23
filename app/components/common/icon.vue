<script lang="ts">
import type {
  IconBindings,
  IconContext,
  IconProps,
} from "#foundation/types/common/icon";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { alias, label, modifiers, tokens, aria } = defineProps<IconProps>();

const el = useTemplateRef<SVGSVGElement>("el");

const bindings = computed<IconBindings>(() =>
  useBindings<"icon">(modifiers, tokens, aria),
);

const ctx = computed<IconContext>(() => ({
  alias,
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <svg
    ref="el"
    :aria-hidden="!label"
    :aria-label="label || undefined"
    :role="label ? 'img' : undefined"
    class="f-icon"
    fill="currentColor"
    v-bind="bindings"
  >
    <use :href="'/icons.svg#' + alias" />
  </svg>
</template>
