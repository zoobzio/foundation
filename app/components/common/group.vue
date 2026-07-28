<script lang="ts">
import type {
  GroupContext,
  GroupProps,
  GroupSlots,
} from "#foundation/types/common/group";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<GroupProps>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = useBindings<"group">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<GroupContext>("group", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<GroupSlots>();
</script>

<template>
  <div ref="el" class="f-group" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </div>
</template>
