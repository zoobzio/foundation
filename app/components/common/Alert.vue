<script lang="ts">
import type { AlertProps } from "#foundation/types/common/alert";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
import Icon from "#foundation/components/common/Icon.vue";
const { label, role = "alert", icon, variant, size, color, radius, density, elevation } = defineProps<AlertProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div ref="el" :role="role" :aria-label="label" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-alert">
    <Icon v-if="icon" :alias="icon" />
    <slot>{{ label }}</slot>
  </div>
</template>
