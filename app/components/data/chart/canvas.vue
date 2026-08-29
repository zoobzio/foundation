<script lang="ts">
import type { ChartCanvasContext, ChartCanvasProps } from "../../../types/data/chart/canvas";

import { useTemplateRef } from "#imports";
import { useChartView } from "../../../composables/chart";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts" generic="T">
const { chart } = defineProps<ChartCanvasProps<T>>();

const el = useTemplateRef<HTMLDivElement>("el");
const canvas = useTemplateRef<HTMLCanvasElement>("canvas");

const { useCanvas } = useChartView(chart);
useCanvas(canvas);

const ctx = useContext<ChartCanvasContext<T>>("data-chart-canvas", () => ({
  chart,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <div ref="el" class="f-group f-data-chart-canvas">
    <canvas ref="canvas" />
  </div>
</template>
