<script setup lang="ts">
type AlertVariant = "note" | "tip" | "important" | "warning" | "caution";

const { variant = "note" } = defineProps<{
  variant?: AlertVariant;
}>();

const variantIcons: Record<AlertVariant, IconAlias> = {
  note: "info",
  tip: "lightbulb",
  important: "important",
  warning: "warning",
  caution: "error",
};

const icon = computed(() => variantIcons[variant]);
</script>

<template>
  <Alert :icon="icon" :variant="variant">
    <slot />
  </Alert>
</template>
