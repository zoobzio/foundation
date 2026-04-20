<script lang="ts">
import { ToastRoot, ToastTitle, ToastDescription, ToastClose } from "reka-ui";
import type { ToastProps, ToastEmits } from "../types/toast";
</script>

<script setup lang="ts">
const { title, description, variant = "info", duration = 5000, pt } = defineProps<ToastProps>();

const emit = defineEmits<ToastEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ title, description, variant, duration }));
</script>

<template>
  <ToastRoot
    ref="el"
    v-bind="pt?.root"
    :class="`f-toast f-toast-${variant}`"
    :duration="duration"
    @update:open="(open: boolean) => { if (!open) emit('close') }"
  >
    <slot name="title" v-bind="ctx">
      <ToastTitle v-if="title" v-bind="pt?.title" class="f-toast-title">
        {{ title }}
      </ToastTitle>
    </slot>
    <slot name="description" v-bind="ctx">
      <ToastDescription v-if="description || $slots.default" v-bind="pt?.description" class="f-toast-description">
        <slot>{{ description }}</slot>
      </ToastDescription>
    </slot>
    <slot name="close" v-bind="ctx">
      <ToastClose v-bind="pt?.close" class="f-toast-close">
        <Icon alias="close" />
      </ToastClose>
    </slot>
  </ToastRoot>
</template>
