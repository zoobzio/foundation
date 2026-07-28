<script lang="ts">
import type {
  DialogProps,
  DialogEmits,
  DialogPassthrough,
  DialogContext,
  DialogSlots,
} from "#foundation/types/core/dialog";
import type { ComponentPublicInstance } from "vue";

import DialogRoot from "#foundation/components/common/dialog/root.vue";
import DialogPortal from "#foundation/components/common/dialog/portal.vue";
import DialogOverlay from "#foundation/components/common/dialog/overlay.vue";
import DialogContent from "#foundation/components/common/dialog/content.vue";
import DialogTitle from "#foundation/components/common/dialog/title.vue";
import DialogDescription from "#foundation/components/common/dialog/description.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
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
  <DialogRoot ref="el" v-bind="settings.root">
    <DialogPortal>
      <slot name="overlay" v-bind="ctx">
        <DialogOverlay v-bind="settings.overlay" />
      </slot>
      <slot name="content" v-bind="ctx">
        <DialogContent v-bind="settings.content">
          <slot name="title" v-bind="ctx">
            <DialogTitle v-bind="settings.title">
              {{ title }}
            </DialogTitle>
          </slot>
          <slot name="description" v-bind="ctx">
            <DialogDescription v-bind="settings.description">
              {{ description }}
            </DialogDescription>
          </slot>
          <slot v-bind="ctx" />
        </DialogContent>
      </slot>
    </DialogPortal>
  </DialogRoot>
</template>
