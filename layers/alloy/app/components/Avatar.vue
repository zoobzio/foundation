<script lang="ts">
import { AvatarRoot, AvatarImage, AvatarFallback } from "reka-ui";
import type { AvatarProps } from "../types/avatar";
</script>

<script setup lang="ts">
const { src, alt, fallback, pt } = defineProps<AvatarProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, {});
const imagePT = usePassthrough(pt?.image, {
  props: { src },
});
const fallbackPT = usePassthrough(pt?.fallback, {});

const ctx = computed(() => ({ src, alt, fallback }));
</script>

<template>
  <slot ref="el" name="root" v-bind="ctx">
    <AvatarRoot v-bind="rootPT.props" v-on="rootPT.handlers" class="f-avatar-root">
      <slot name="image" v-bind="ctx">
        <AvatarImage
          :alt="alt"
          v-bind="imagePT.props"
          v-on="imagePT.handlers"
          class="f-avatar-image"
        />
      </slot>
      <slot name="fallback" v-bind="ctx">
        <AvatarFallback
          v-bind="fallbackPT.props"
          v-on="fallbackPT.handlers"
          class="f-avatar-fallback"
        >
          {{ fallback }}
        </AvatarFallback>
      </slot>
    </AvatarRoot>
  </slot>
</template>
