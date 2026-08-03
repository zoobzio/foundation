<script lang="ts">
import type {
  HrContext,
  HrProps,
} from "#foundation/types/common/hr";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<HrProps>();

const el = useTemplateRef<HTMLHRElement>("el");

const bindings = useBindings<"hr">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<HrContext>("hr", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <hr ref="el" class="f-hr" v-bind="bindings">
</template>
