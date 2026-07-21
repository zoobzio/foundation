<script lang="ts">
import type { AlertProps } from "#foundation/types/common/alert";
import { useTemplateRef } from "#imports";
import Icon from "#foundation/components/common/Icon.vue";
</script>

<script setup lang="ts">
const { label, role = "alert", icon } = defineProps<AlertProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div ref="el" :role="role" :aria-label="label" class="f-alert">
    <Icon v-if="icon" :alias="icon" />
    <slot>{{ label }}</slot>
  </div>
</template>
