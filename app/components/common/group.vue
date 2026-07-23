<script lang="ts">
import type {
  GroupBindings,
  GroupContext,
  GroupProps,
  GroupSlots,
} from "#foundation/types/common/group";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<GroupProps>();

defineSlots<GroupSlots>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = computed<GroupBindings>(() =>
  useBindings<"group">(modifiers, tokens, aria),
);

const ctx = computed<GroupContext>(() => ({
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
  <div ref="el" class="f-group" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </div>
</template>
