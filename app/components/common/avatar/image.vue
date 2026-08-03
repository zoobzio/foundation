<script lang="ts">
import type {
  AvatarImageContext,
  AvatarImageForward,
  AvatarImageProps,
  AvatarImageSlots,
} from "#foundation/types/common/avatar/image";
import type { ComponentPublicInstance } from "vue";

import { AvatarImage, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<AvatarImageProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"avatar-image", AvatarImageForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<AvatarImageContext>("avatar-image", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AvatarImageSlots>();
</script>

<template>
  <AvatarImage ref="el" class="f-avatar-image" v-bind="bindings">
    <slot v-bind="ctx" />
  </AvatarImage>
</template>
