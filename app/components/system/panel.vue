<script lang="ts">
import type {
  PanelContext,
  PanelPassthrough,
  PanelProps,
  PanelSlots,
  Regions,
} from "../../types/system/panel";
import type { AnyWidget, Widgets } from "../../types/widget";
import type { ComponentPublicInstance } from "vue";

import Group from "../common/group.vue";

import { computed, toValue, useTemplateRef } from "#imports";
import { PANEL_REGIONS } from "../../constants/panel";
import { usePassthrough } from "../../composables/passthrough";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="R extends Widgets & Regions">
const { panel, pt } = defineProps<PanelProps<R>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const regions = computed(() => {
  const widgets: Record<string, AnyWidget> = panel.widgets;
  return PANEL_REGIONS.map((region) => ({
    region,
    key: String(region),
    widget: widgets[region],
  }));
});

const settings = usePassthrough<PanelPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    header: {},
    content: {},
    footer: {},
  },
}));

const ctx = useContext<PanelContext<R>>("system-panel", () => ({
  panel,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
const slots = defineSlots<PanelSlots<R>>();
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-system-panel">
    <template v-for="r in regions" :key="r.region">
      <Group
        v-if="r.widget !== undefined || slots[r.region] !== undefined"
        v-bind="settings[r.region]"
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
      </Group>
    </template>
  </Group>
</template>
