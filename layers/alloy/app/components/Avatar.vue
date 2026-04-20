<script lang="ts">
import { AvatarRoot, AvatarImage, AvatarFallback } from "reka-ui";
import type { AvatarProps } from "../types/avatar";
</script>

<script setup lang="ts">
const { src, alt, fallback, pt } = defineProps<AvatarProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ src, alt, fallback }));
</script>

<template>
  <slot ref="el" name="root" v-bind="ctx">
    <AvatarRoot v-bind="pt?.root" class="f-avatar-root">
      <slot name="image" v-bind="ctx">
        <AvatarImage
          :src="src"
          :alt="alt"
          v-bind="pt?.image"
          class="f-avatar-image"
        />
      </slot>
      <slot name="fallback" v-bind="ctx">
        <AvatarFallback
          v-bind="pt?.fallback"
          class="f-avatar-fallback"
        >
          {{ fallback }}
        </AvatarFallback>
      </slot>
    </AvatarRoot>
  </slot>
</template>

