<script lang="ts">
import type {
  AvatarProps,
  AvatarPassthrough,
  AvatarContext,
  AvatarSlots,
} from "../../types/core/avatar";
import type { ComponentPublicInstance } from "vue";

import AvatarRoot from "../common/avatar/root.vue";
import AvatarImage from "../common/avatar/image.vue";
import AvatarFallback from "../common/avatar/fallback.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { src, alt, fallback, pt } = defineProps<AvatarProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<AvatarPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    image: { src, alt },
    fallback: {},
  },
}));

const ctx = useContext<AvatarContext>("avatar", () => ({
  src,
  alt,
  fallback,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<AvatarSlots>();
</script>

<template>
  <slot name="root" v-bind="ctx">
    <AvatarRoot ref="el" v-bind="settings.root">
      <slot name="image" v-bind="ctx">
        <AvatarImage v-bind="settings.image" />
      </slot>
      <slot name="fallback" v-bind="ctx">
        <AvatarFallback v-bind="settings.fallback">
          {{ fallback }}
        </AvatarFallback>
      </slot>
    </AvatarRoot>
  </slot>
</template>
