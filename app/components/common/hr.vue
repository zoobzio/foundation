<script lang="ts">
import type {
  HrBindings,
  HrContext,
  HrProps,
} from "#foundation/types/common/hr";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<HrProps>();

const el = useTemplateRef<HTMLHRElement>("el");

const bindings = computed<HrBindings>(() =>
  useBindings<"hr">(modifiers, tokens, aria),
);

const ctx = computed<HrContext>(() => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <hr ref="el" class="f-hr" v-bind="bindings" />
</template>
