<script lang="ts">
import type {
  ChartWidgetContext,
  ChartWidgetEmits,
  ChartWidgetPassthrough,
  ChartWidgetProps,
  ChartWidgetSlots,
} from "../../../types/data/chart/widget";
import type { Events } from "../../../types/data/chart";

import Canvas from "./canvas.vue";
import Control from "./control.vue";
import Fab from "../../core/fab.vue";

import { useTemplateRef } from "#imports";
import { useChartView } from "../../../composables/chart";
import { useHooks } from "../../../composables/hook";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useLazyRequest } from "../../../composables/request";
import { useForwardSlots } from "../../../composables/slots";
import {
  CHART_CONTROL_SLOTS,
  CHART_REFRESH_LABEL,
} from "../../../constants/chart";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<ChartWidgetProps<T>>();

const emit = defineEmits<ChartWidgetEmits>();

useHooks<Events>(service.id, {
  "chart:updated": (event) => emit("updated", event),
  "chart:variant-changed": (event) => emit("variant-changed", event),
  "chart:renderer-changed": (event) => emit("renderer-changed", event),
});

const el = useTemplateRef<HTMLDivElement>("el");

const { loading, variantData, titleControls, actionControls } =
  useChartView(service);

const settings = usePassthrough<ChartWidgetPassthrough<T>>(() => ({
  pt,
  recipes: {
    control: (anchor) => ({ chart: service, ...anchor }),
    refresh: { label: CHART_REFRESH_LABEL, onClick: () => service.fetch() },
  },
}));

const ctx = useContext<ChartWidgetContext<T>>("data-chart", () => ({
  chart: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<ChartWidgetSlots<T>>();

// Control slots relay to every control in both regions, filtered so each
// control keeps its own defaults for any the consumer didn't supply.
const controlSlots = useForwardSlots(slots, CHART_CONTROL_SLOTS);

useLazyRequest(`init-chart-${service.id}`, () => service.init());
</script>

<template>
  <div ref="el" class="f-group f-data-chart">
    <slot name="toolbar" v-bind="ctx">
      <div class="f-group f-data-chart-toolbar">
        <div class="f-group f-data-chart-title">
          <Control
            v-for="c in titleControls"
            :key="c.kind"
            v-bind="settings.control(c)"
          >
            <template
              v-for="name in controlSlots"
              :key="name"
              #[name]="slotProps"
            >
              <slot :name="name" v-bind="slotProps" />
            </template>
            <template
              v-if="slots.controlOptionIcon"
              #controlOptionIcon="slotProps"
            >
              <slot name="controlOptionIcon" v-bind="slotProps" />
            </template>
          </Control>
        </div>
        <div class="f-group f-data-chart-actions">
          <Control
            v-for="c in actionControls"
            :key="c.kind"
            v-bind="settings.control(c)"
          >
            <template
              v-for="name in controlSlots"
              :key="name"
              #[name]="slotProps"
            >
              <slot :name="name" v-bind="slotProps" />
            </template>
            <template
              v-if="slots.controlOptionIcon"
              #controlOptionIcon="slotProps"
            >
              <slot name="controlOptionIcon" v-bind="slotProps" />
            </template>
          </Control>
          <Fab v-bind="settings.refresh">
            <template v-if="slots.refreshIcon" #icon>
              <slot name="refreshIcon" v-bind="ctx" />
            </template>
          </Fab>
        </div>
      </div>
    </slot>

    <slot v-if="loading" name="loading" v-bind="ctx" />
    <slot v-else-if="!variantData" name="empty" v-bind="ctx" />
    <Canvas v-else :chart="service" />
  </div>
</template>
