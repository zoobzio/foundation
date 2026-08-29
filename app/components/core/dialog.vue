<script lang="ts">
import type {
  DialogProps,
  DialogEmits,
  DialogPassthrough,
  DialogContext,
  DialogSlots,
} from "../../types/core/dialog";
import type { ComponentPublicInstance } from "vue";

import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const {
  title,
  description,
  open = undefined,
  pt,
} = defineProps<DialogProps>();

const emit = defineEmits<DialogEmits>();

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<DialogPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      open: $open.value,
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    overlay: {},
    content: {},
    title: {},
    description: {},
  },
}));

const ctx = useContext<DialogContext>("dialog", () => ({
  title,
  description,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<DialogSlots>();
</script>

<template>
  <DialogRoot ref="el" class="f-dialog-root" v-bind="settings.root">
    <DialogPortal>
      <slot name="overlay" v-bind="ctx">
        <DialogOverlay class="f-dialog-overlay" v-bind="settings.overlay" />
      </slot>
      <slot name="content" v-bind="ctx">
        <DialogContent class="f-dialog-content" v-bind="settings.content">
          <slot name="title" v-bind="ctx">
            <DialogTitle class="f-dialog-title" v-bind="settings.title">
              {{ title }}
            </DialogTitle>
          </slot>
          <slot name="description" v-bind="ctx">
            <DialogDescription
              class="f-dialog-description"
              v-bind="settings.description"
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
