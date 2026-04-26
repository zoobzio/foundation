<script lang="ts">
import { ToastProvider, ToastViewport } from "reka-ui";
import type { ToasterProps } from "../types/toaster";
</script>

<script setup lang="ts">
const { pt } = defineProps<ToasterProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const providerPT = usePassthrough(pt?.provider, { props: {}, handlers: {} });
const viewportPT = usePassthrough(pt?.viewport, { props: {}, handlers: {} });

const ctx = computed(() => ({}));
</script>

<template>
  <slot name="root" v-bind="ctx">
    <ToastProvider ref="el" v-bind="providerPT.props" v-on="providerPT.handlers">
      <slot name="toasts" v-bind="ctx" />
      <slot name="viewport" v-bind="ctx">
        <ToastViewport v-bind="viewportPT.props" class="f-toast-viewport" v-on="viewportPT.handlers" />
      </slot>
    </ToastProvider>
  </slot>
</template>
