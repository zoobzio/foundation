<script lang="ts">
import type { ErrorData } from "./types/error";

import Toast from "@zoobzio/vue/components/toast.vue";
import Toaster from "@zoobzio/vue/components/toaster.vue";
import {
  NuxtErrorBoundary,
  NuxtLayout,
  NuxtLoadingIndicator,
  NuxtPage,
} from "#components";

import { ConfigProvider, TooltipProvider } from "reka-ui";
import { isNuxtError, useHead } from "#app";
import { useId } from "vue";
import { useNotifications } from "./composables/notification";
</script>

<script setup lang="ts">
const useIdFunction = () => useId();

useHead({
  htmlAttrs: {
    lang: "en",
  },
});

const { notifications, push, remove } = useNotifications();

const onError = (err: unknown) => {
  const data = isNuxtError<ErrorData>(err) ? err.data : undefined;

  if (data?.notification) {
    push(data.notification);
    return;
  }

  push({
    title: err instanceof Error ? err.message : "An unexpected error occurred",
    variant: "error",
  });
};
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <TooltipProvider>
      <NuxtLoadingIndicator color="var(--primary)" :threshold="0" />
      <NuxtErrorBoundary @error="onError">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </NuxtErrorBoundary>
      <Toaster>
        <template #toasts>
          <Toast
            v-for="notification in notifications"
            :key="notification.id"
            :title="notification.title"
            :description="notification.description"
            :variant="notification.variant"
            @close="remove(notification.id)"
          />
        </template>
      </Toaster>
    </TooltipProvider>
  </ConfigProvider>
</template>
