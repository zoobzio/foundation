<script setup lang="ts">
type AlertType = "note" | "tip" | "important" | "warning" | "caution";

const { type = "note" } = defineProps<{
  type?: AlertType;
}>();

const typeIcons: Record<AlertType, IconAlias> = {
  note: "info",
  tip: "lightbulb",
  important: "important",
  warning: "warning",
  caution: "error",
};

const icon = computed(() => typeIcons[type]);
</script>

<template>
  <Alert :icon="icon" :data-type="type">
    <slot />
  </Alert>
</template>
