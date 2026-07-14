<script setup lang="ts">
import { clearError, computed } from "#imports";
import { ERROR_DEFAULT_STATUS_CODE, ERROR_NOT_FOUND_STATUS_CODE } from "#foundation/constants/system/error";
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const statusCode = computed(() => props.error.statusCode ?? ERROR_DEFAULT_STATUS_CODE);
const message = computed(() => {
  if (statusCode.value === ERROR_NOT_FOUND_STATUS_CODE) return "The page you're looking for doesn't exist.";
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
