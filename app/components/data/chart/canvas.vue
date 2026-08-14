<script lang="ts">
import type {
  ChartCanvasContext,
  ChartCanvasPassthrough,
  ChartCanvasProps,
} from "../../../types/data/chart/canvas";
import type { ComponentPublicInstance } from "vue";

import Group from "../../common/group.vue";

import { useTemplateRef } from "#imports";
import { useChart } from "../../../composables/chart";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
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
