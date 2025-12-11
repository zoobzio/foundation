<script lang="ts">
export interface DialogProps {
  title: string;
  description: string;
  open?: boolean;
  tokens?: Tokens<
    "dialog-overlay" | "dialog-content" | "dialog-title" | "dialog-description"
  >;
}
</script>

<script setup lang="ts">
const { title, description, open, tokens } = defineProps<DialogProps>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay
        :style="styles['dialog-overlay']"
        class="f-dialog-overlay"
      />
      <DialogContent :style="styles['dialog-content']" class="f-dialog-content">
        <DialogTitle
          :style="styles['dialog-title']"
          class="f-dialog-title"
        >
          {{ title }}
        </DialogTitle>
        <DialogDescription
          :style="styles['dialog-description']"
          class="f-dialog-description"
        >
          {{ description }}
        </DialogDescription>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
@import '#build/untheme/dialog-overlay.css';
@import '#build/untheme/dialog-content.css';
@import '#build/untheme/dialog-title.css';
@import '#build/untheme/dialog-description.css';
</style>
