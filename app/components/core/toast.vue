<script lang="ts">
import type {
  ToastProps,
  ToastEmits,
  ToastPassthrough,
  ToastContext,
  ToastSlots,
} from "../../types/core/toast";
import type { ComponentPublicInstance } from "vue";

import ToastRoot from "../common/toast/root.vue";
import ToastTitle from "../common/toast/title.vue";
import ToastDescription from "../common/toast/description.vue";
import ToastClose from "../common/toast/close.vue";
import Icon from "../common/icon.vue";

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
  duration,
  pt,
} = defineProps<ToastProps>();

const emit = defineEmits<ToastEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: true },
);

const settings = usePassthrough<ToastPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      open: $open.value,
      duration,
      "onUpdate:open": (v) => {
        $open.value = v;
        if (!v) emit("close");
      },
    },
    title: {},
    description: {},
    close: {},
    closeIcon: { alias: "close" },
  },
}));

const ctx = useContext<ToastContext>("toast", () => ({
  title,
  description,
  duration,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<ToastSlots>();
</script>

<template>
  <ToastRoot ref="el" v-bind="settings.root">
    <slot name="title" v-bind="ctx">
      <ToastTitle v-if="title" v-bind="settings.title">
        {{ title }}
      </ToastTitle>
    </slot>
    <slot name="description" v-bind="ctx">
      <ToastDescription v-if="description" v-bind="settings.description">
        {{ description }}
      </ToastDescription>
    </slot>
    <slot name="close" v-bind="ctx">
      <ToastClose v-bind="settings.close">
        <slot name="closeIcon" v-bind="ctx">
          <Icon v-bind="settings.closeIcon" />
        </slot>
      </ToastClose>
    </slot>
  </ToastRoot>
</template>
