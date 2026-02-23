<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="f-widget">
    <header v-if="title || $slots.header || $slots.actions" class="f-widget-header">
      <slot name="header">
        <H2 class="f-widget-title">{{ title }}</H2>
      </slot>
      <div v-if="$slots.actions" class="f-widget-actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="f-widget-body">
      <slot />
    </div>
  </div>
</template>
