<script lang="ts">
import type { DataChartCanvasProps } from "#foundation/types/data/chart-canvas";
</script>

<script setup lang="ts" generic="T">
import { onBeforeUnmount, useTemplateRef, watchEffect } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import Group from "#foundation/components/common/Group.vue";
const { chart, pt } = defineProps<DataChartCanvasProps<T>>();

const el = useTemplateRef("el");
defineExpose({ el });

const canvasRef = useTemplateRef<HTMLCanvasElement>("canvas");

const { canvas } = chart;

watchEffect(() => {
  canvas.value = canvasRef.value;
});

onBeforeUnmount(() => {
  canvas.value = null;
});

const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-chart-canvas"
    v-on="rootPT.handlers"
  >
    <canvas ref="canvas" />
  </Group>
</template>
