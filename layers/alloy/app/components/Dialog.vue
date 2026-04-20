<script lang="ts">
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from "reka-ui";
import type { DialogProps, DialogEmits } from "../types/dialog";
</script>

<script setup lang="ts">
const { title, description, open, pt } = defineProps<DialogProps>();

const emit = defineEmits<DialogEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ title, description, open }));

</script>

<template>
  <DialogRoot ref="el" :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <slot name="overlay" v-bind="ctx">
        <DialogOverlay
          v-bind="pt?.overlay"
          class="f-dialog-overlay"
        />
      </slot>
      <slot name="content" v-bind="ctx">
        <DialogContent v-bind="pt?.content" class="f-dialog-content">
          <slot name="title" v-bind="ctx">
            <DialogTitle
              v-bind="pt?.title"
              class="f-dialog-title"
            >
              {{ title }}
            </DialogTitle>
          </slot>
          <slot name="description" v-bind="ctx">
            <DialogDescription
              v-bind="pt?.description"
              class="f-dialog-description"
            >
              {{ description }}
            </DialogDescription>
          </slot>
          <slot v-bind="ctx" />
        </DialogContent>
      </slot>
    </DialogPortal>
  </DialogRoot>
</template>

