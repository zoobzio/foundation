<script lang="ts">
import type {
  ToasterProps,
  ToasterPassthrough,
  ToasterContext,
  ToasterSlots,
} from "../../types/core/toaster";
import type { ComponentPublicInstance } from "vue";

import ToastProvider from "../common/toast/provider.vue";
import ToastViewport from "../common/toast/viewport.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { pt } = defineProps<ToasterProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<ToasterPassthrough>(() => ({
  pt,
  recipes: {
    provider: {},
    viewport: {},
  },
}));

const ctx = useContext<ToasterContext>("toaster", () => ({
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<ToasterSlots>();
</script>

<template>
  <ToastProvider ref="el" v-bind="settings.provider">
    <slot name="toasts" v-bind="ctx" />
    <slot name="viewport" v-bind="ctx">
      <ToastViewport v-bind="settings.viewport" />
    </slot>
  </ToastProvider>
</template>
