<script lang="ts">
import type { ChipProps, ChipEmits } from "../types/chip";
</script>

<script setup lang="ts">
const { pt, label, closable } = defineProps<ChipProps>();
const emit = defineEmits<ChipEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const handleClick = () => {
  if (closable) emit('close');
};

const ctx = computed(() => ({
  label,
  closable,
}));
</script>

<template>
  <Button
    v-if="closable"
    ref="el"
    type="button"
    v-bind="pt?.root"
    class="f-chip f-chip--closable"
    @click="handleClick"
  >
    <slot v-bind="ctx">{{ label }}</slot>
    <Icon alias="close" class="f-chip-close" />
  </Button>
  <Group v-else v-bind="pt?.root" class="f-chip">
    <slot v-bind="ctx">{{ label }}</slot>
  </Group>
</template>

