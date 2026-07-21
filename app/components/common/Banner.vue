<script lang="ts">
import type { BannerProps } from "#foundation/types/common/banner";
import { useTemplateRef } from "#imports";
import Icon from "#foundation/components/common/Icon.vue";
</script>

<script setup lang="ts">
const { label, role = "banner", icon } = defineProps<BannerProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div ref="el" :role="role" :aria-label="label" class="f-banner">
    <Icon v-if="icon" :alias="icon" />
    <slot>{{ label }}</slot>
  </div>
</template>
