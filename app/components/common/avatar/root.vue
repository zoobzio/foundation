<script lang="ts">
import type {
  AvatarRootContext,
  AvatarRootForward,
  AvatarRootProps,
  AvatarRootSlots,
} from "#foundation/types/common/avatar/root";
import type { ComponentPublicInstance } from "vue";

import { AvatarRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<AvatarRootProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"avatar-root", AvatarRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<AvatarRootContext>("avatar-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AvatarRootSlots>();
</script>

<template>
  <AvatarRoot ref="el" class="f-avatar-root" v-bind="bindings">
    <slot v-bind="ctx" />
  </AvatarRoot>
</template>
