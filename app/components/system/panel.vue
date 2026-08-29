<script lang="ts">
import type {
  PanelContext,
  PanelProps,
  PanelSlots,
  Regions,
} from "../../types/system/panel";
import type { AnyWidget, Widgets } from "../../types/widget";

import { computed, toValue, useTemplateRef } from "#imports";
import { PANEL_REGIONS } from "../../constants/panel";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="R extends Widgets & Regions">
const { panel } = defineProps<PanelProps<R>>();

const el = useTemplateRef<HTMLDivElement>("el");

const regions = computed(() => {
  const widgets: Record<string, AnyWidget> = panel.widgets;
  return PANEL_REGIONS.map((region) => ({
    region,
    key: String(region),
    widget: widgets[region],
  }));
});

const ctx = useContext<PanelContext<R>>("system-panel", () => ({
  panel,
  el: el.value,
}));

defineExpose({ ctx });
const slots = defineSlots<PanelSlots<R>>();
</script>

<template>
  <div ref="el" class="f-group f-system-panel">
    <template v-for="r in regions" :key="r.region">
      <div
        v-if="r.widget !== undefined || slots[r.region] !== undefined"
        class="f-group"
        :class="`f-system-panel-${r.region}`"
      >
        <slot :name="r.region" v-bind="{ ...ctx, region: r.region }">
          <template v-if="r.widget">
            <slot
              :name="`widget:${r.key}`"
              v-bind="{ ...ctx, region: r.region, service: r.widget.service }"
            >
              <component
                :is="r.widget.component"
                :service="r.widget.service"
                :pt="toValue(r.widget.settings)"
              />
            </slot>
          </template>
        </slot>
      </div>
    </template>
  </div>
</template>
