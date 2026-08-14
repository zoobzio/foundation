<script lang="ts">
import type {
  ChartControlContext,
  ChartControlPassthrough,
  ChartControlProps,
} from "../../../types/data/chart/control";
import type { ComponentPublicInstance } from "vue";

import Button from "../../common/button.vue";
import Fab from "../../core/fab.vue";
import Icon from "../../common/icon.vue";
import Menu from "../../core/menu.vue";

import { computed, useTemplateRef } from "#imports";
import { useChart } from "../../../composables/chart";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { CHART_CONTROL_CHEVRON } from "../../../constants/chart";
</script>

<script setup lang="ts" generic="T">
const { chart, kind, align, options, trigger, pt } =
  defineProps<ChartControlProps<T>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const { useControl } = useChart(chart);
const { recipes } = useControl(() => ({
  kind,
  align,
  options,
  trigger,
}));

const settings = usePassthrough<ChartControlPassthrough>(() => ({
  pt,
  recipes: {
    trigger: {},
    chevron: { alias: CHART_CONTROL_CHEVRON },
    fab: {},
    ...recipes.value,
  },
}));

const ctx = useContext<ChartControlContext<T>>("data-chart-control", () => ({
  chart,
  kind,
  align,
  options,
  trigger,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const titleTrigger = computed(() =>
  trigger.type === "title" ? trigger : null,
);
const fabTrigger = computed(() => (trigger.type === "fab" ? trigger : null));
</script>

<template>
  <Menu ref="el" v-bind="settings.menu" class="f-data-chart-control">
    <template #trigger>
      <Button
        v-if="titleTrigger"
        v-bind="settings.trigger"
        class="f-data-chart-control-title"
      >
        {{ titleTrigger.label }}
        <Icon v-bind="settings.chevron" class="f-data-chart-control-chevron" />
      </Button>
      <Fab
        v-else-if="fabTrigger"
        v-bind="settings.fab"
        :icon="fabTrigger.icon"
        :label="fabTrigger.label"
      />
    </template>
  </Menu>
</template>
