<script lang="ts">
import type {
  IconContext,
  IconProps,
} from "../../types/common/icon";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { alias, label, modifiers, tokens, aria } = defineProps<IconProps>();

const el = useTemplateRef<SVGSVGElement>("el");

const bindings = useBindings<"icon">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<IconContext>("icon", () => ({
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
