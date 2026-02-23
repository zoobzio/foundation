<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="f-page">
    <header class="f-page-header">
      <slot name="header">
        <H1 v-if="title">{{ title }}</H1>
      </slot>
    </header>
    <div class="f-page-content">
      <slot />
    </div>
  </div>
</template>
