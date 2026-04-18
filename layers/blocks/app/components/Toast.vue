<script setup lang="ts">
import type { ToastProps, ToastEmits } from "../types/toast";

const { title, description, variant = "info", duration = 5000 } = defineProps<ToastProps>();

const emit = defineEmits<ToastEmits>();
</script>

<template>
  <ToastRoot
    :class="`f-toast f-toast-${variant}`"
    :duration="duration"
    @update:open="(open) => { if (!open) emit('close') }"
  >
    <ToastTitle v-if="title" class="f-toast-title">
      {{ title }}
    </ToastTitle>
    <ToastDescription v-if="description || $slots.default" class="f-toast-description">
      <slot>{{ description }}</slot>
    </ToastDescription>
    <ToastClose class="f-toast-close">
      <Icon alias="close" />
    </ToastClose>
  </ToastRoot>
</template>
