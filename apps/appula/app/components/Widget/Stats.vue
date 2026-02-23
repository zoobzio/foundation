<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  description?: string;
}>();
</script>

<template>
  <DataWidget :title="title">
    <div class="f-widget-stats">
      <span class="f-widget-stats-value">{{ value }}</span>
      <span v-if="description" class="f-widget-stats-description">{{ description }}</span>
    </div>
  </DataWidget>
</template>
