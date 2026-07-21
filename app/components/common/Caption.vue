<script lang="ts">
import type { CaptionProps } from "#foundation/types/common/caption";
import { useTemplateRef } from "#imports";
import Icon from "#foundation/components/common/Icon.vue";
</script>

<script setup lang="ts">
const { label, icon } = defineProps<CaptionProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div ref="el" :aria-label="label" class="f-caption">
    <Icon v-if="icon" :alias="icon" />
    <slot>{{ label }}</slot>
  </div>
</template>
