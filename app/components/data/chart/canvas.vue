<script lang="ts">
import type {
  ChartCanvasContext,
  ChartCanvasPassthrough,
  ChartCanvasProps,
} from "#foundation/types/data/chart/canvas";
import type { ComponentPublicInstance } from "vue";

import Group from "#foundation/components/common/group.vue";

import { useTemplateRef } from "#imports";
import { useChart } from "#foundation/composables/chart";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts" generic="T">
const { chart, pt } = defineProps<ChartCanvasProps<T>>();

const el = useTemplateRef<ComponentPublicInstance>("el");
const canvas = useTemplateRef<HTMLCanvasElement>("canvas");

const { useCanvas } = useChart(chart);
useCanvas(canvas);

const settings = usePassthrough<ChartCanvasPassthrough>(() => ({
  pt,
  recipes: { root: {} },
}));

const ctx = useContext<ChartCanvasContext<T>>("data-chart-canvas", () => ({
  chart,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-data-chart-canvas">
    <canvas ref="canvas" />
  </Group>
</template>
