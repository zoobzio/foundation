<script lang="ts">
import type {
  AnchorBindings,
  AnchorContext,
  AnchorProps,
  AnchorSlots,
} from "#foundation/types/common/anchor";
import type { ComponentPublicInstance } from "vue";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
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

defineSlots<AnchorSlots>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const bindings = computed<AnchorBindings>(() =>
  useBindings<"anchor">(modifiers, tokens, aria),
);

const ctx = computed<AnchorContext>(() => ({
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
  >
    <slot :ctx="ctx">{{ label }}</slot>
  </NuxtLink>
</template>
