<script lang="ts">
import type {
  ChartWidgetContext,
  ChartWidgetEmits,
  ChartWidgetPassthrough,
  ChartWidgetProps,
  ChartWidgetSlots,
} from "../../../types/data/chart/widget";
import type { Events } from "../../../types/data/chart";
import type { ComponentPublicInstance } from "vue";

import Canvas from "./canvas.vue";
import Control from "./control.vue";
import Fab from "../../core/fab.vue";
import Group from "../../common/group.vue";

import { useTemplateRef } from "#imports";
import { useChartView } from "../../../composables/chart";
import { useHooks } from "../../../composables/hook";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useLazyRequest } from "../../../composables/request";
import { CHART_REFRESH_ICON } from "../../../constants/chart";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<ChartWidgetProps<T>>();

const emit = defineEmits<ChartWidgetEmits>();

useHooks<Events>(service.id, {
  "chart:updated": (event) => emit("updated", event),
  "chart:variant-changed": (event) => emit("variant-changed", event),
  "chart:renderer-changed": (event) => emit("renderer-changed", event),
});

const el = useTemplateRef<ComponentPublicInstance>("el");

const { loading, variantData, titleControls, actionControls } =
  useChartView(service);

const settings = usePassthrough<ChartWidgetPassthrough<T>>(() => ({
  pt,
  recipes: {
    root: {},
    toolbar: {},
    title: {},
    actions: {},
    control: (anchor) => ({ chart: service, ...anchor }),
    refresh: { icon: CHART_REFRESH_ICON, onClick: () => service.fetch() },
  },
}));

const ctx = useContext<ChartWidgetContext<T>>("data-chart", () => ({
  chart: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

defineSlots<ChartWidgetSlots<T>>();

useLazyRequest(`init-chart-${service.id}`, () => service.init());
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-data-chart">
    <slot name="toolbar" v-bind="ctx">
      <Group v-bind="settings.toolbar" class="f-data-chart-toolbar">
        <Group v-bind="settings.title" class="f-data-chart-title">
          <Control
            v-for="c in titleControls"
            :key="c.kind"
            v-bind="settings.control(c)"
          />
        </Group>
        <Group v-bind="settings.actions" class="f-data-chart-actions">
          <Control
            v-for="c in actionControls"
            :key="c.kind"
            v-bind="settings.control(c)"
          />
          <Fab v-bind="settings.refresh" />
        </Group>
      </Group>
    </slot>

    <slot v-if="loading" name="loading" v-bind="ctx" />
    <slot v-else-if="!variantData" name="empty" v-bind="ctx" />
    <Canvas v-else :chart="service" :pt="pt?.canvas" />
  </Group>
</template>
