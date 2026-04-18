<script setup lang="ts">
</script>

<template>
  <ToastProvider>
    <slot />
    <ToastViewport class="f-toast-viewport" />
  </ToastProvider>
</template>
