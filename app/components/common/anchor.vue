<script lang="ts">
import type {
  AnchorContext,
  AnchorEmits,
  AnchorProps,
  AnchorSlots,
} from "#foundation/types/common/anchor";
import type { ComponentPublicInstance } from "vue";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  label,
  to,
  external,
  target,
  replace,
  prefetch,
  disabled,
  modifiers,
  tokens,
  aria,
} = defineProps<AnchorProps>();

const emit = defineEmits<AnchorEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const bindings = useBindings<"anchor">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<AnchorContext>("anchor", () => ({
  label,
  to,
  external,
  target,
  replace,
  prefetch,
  disabled,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AnchorSlots>();
</script>

<template>
  <NuxtLink
    ref="el"
    :to="disabled ? undefined : to"
    :external="external"
    :target="target"
    :replace="replace"
    :prefetch="prefetch"
    :aria-disabled="disabled"
    :aria-current="disabled ? 'page' : undefined"
    class="f-anchor"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx">{{ label }}</slot>
  </NuxtLink>
</template>
