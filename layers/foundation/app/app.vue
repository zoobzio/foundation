<script lang="ts">
import { ConfigProvider, TooltipProvider } from "reka-ui";
</script>

<script setup lang="ts">
const useIdFunction = () => useId();

useHead({
  htmlAttrs: {
    lang: "en",
  },
});

const toasts = useToasts();

const severityToVariant: Record<Severity, NonNullable<ToastProps["variant"]>> = {
  fatal: "error",
  error: "error",
  warning: "warning",
  info: "info",
};

const onError = (err: unknown) => {
  const payload = err instanceof Error && "data" in err
    ? (err as AppError).data
    : undefined;

  if (payload?.severity) {
    toasts.push({
      title: (err as AppError).message,
      variant: severityToVariant[payload.severity],
    });
    return;
  }

  toasts.push({
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
            v-for="t in toasts.items.value"
            :key="t.id"
            :title="t.title"
            :description="t.description"
            :variant="t.variant"
            @close="toasts.remove(t.id)"
          />
        </template>
      </Toaster>
    </TooltipProvider>
  </ConfigProvider>
</template>

<style>
html,
body {
  background: var(--sys-surface);
}

::selection {
  background: var(--sys-secondary);
  color: var(--sys-on-secondary);
}
</style>
