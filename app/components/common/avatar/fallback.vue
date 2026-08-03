<script lang="ts">
import type {
  AvatarFallbackContext,
  AvatarFallbackForward,
  AvatarFallbackProps,
  AvatarFallbackSlots,
} from "#foundation/types/common/avatar/fallback";
import type { ComponentPublicInstance } from "vue";

import { AvatarFallback, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<AvatarFallbackProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"avatar-fallback", AvatarFallbackForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<AvatarFallbackContext>("avatar-fallback", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AvatarFallbackSlots>();
</script>

<template>
  <AvatarFallback ref="el" class="f-avatar-fallback" v-bind="bindings">
    <slot v-bind="ctx" />
  </AvatarFallback>
</template>
