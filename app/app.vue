<script lang="ts">
import type { AppError } from "#foundation/types/error";

import TooltipProvider from "#foundation/components/common/tooltip/provider.vue";
import Toast from "#foundation/components/core/toast.vue";
import Toaster from "#foundation/components/core/toaster.vue";

import { ConfigProvider } from "reka-ui";
import { useHead, useId } from "#imports";
import { useNotifications } from "~/composables/notification";
import { severityToVariant } from "#foundation/constants/error";
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
  const payload =
    err instanceof Error && "data" in err ? (err as AppError).data : undefined;

  if (payload?.severity) {
    push({
      title: (err as AppError).message,
      variant: severityToVariant[payload.severity],
    });
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
      <NuxtLoadingIndicator color="var(--sys-primary)" :threshold="0" />
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
            :pt="{ root: { modifiers: { variant: notification.variant } } }"
            @close="remove(notification.id)"
          />
        </template>
      </Toaster>
    </TooltipProvider>
  </ConfigProvider>
</template>
