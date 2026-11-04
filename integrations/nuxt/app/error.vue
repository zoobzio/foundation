<script lang="ts">
import type { NuxtError } from "#app";

import { clearError, useNuxtApp } from "#app";
import { computed } from "vue";
import {
  ERROR_DEFAULT_STATUS_CODE,
  ERROR_NOT_FOUND_STATUS_CODE,
} from "./constants/error";
</script>

<script setup lang="ts">
const props = defineProps<{
  error: NuxtError;
}>();

const { $t: t } = useNuxtApp();

const statusCode = computed(
  () => props.error.statusCode ?? ERROR_DEFAULT_STATUS_CODE,
);

const message = computed(() => {
  if (statusCode.value === ERROR_NOT_FOUND_STATUS_CODE)
    return t("error.notFound");
  return props.error.message || t("error.unknown");
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="f-error-page">
    <span class="f-error-code">{{ statusCode }}</span>
    <span class="f-error-message">{{ message }}</span>
    <button class="f-error-action" @click="handleError">
      {{ t("error.home") }}
    </button>
  </div>
</template>
