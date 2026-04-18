<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const statusCode = computed(() => props.error.statusCode ?? 500);
const message = computed(() => {
  if (statusCode.value === 404) return "The page you're looking for doesn't exist.";
  return props.error.message || "Something went wrong.";
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="f-error-page">
    <span class="f-error-code">{{ statusCode }}</span>
    <span class="f-error-message">{{ message }}</span>
    <button class="f-error-action" @click="handleError">
      Go home
    </button>
  </div>
</template>
