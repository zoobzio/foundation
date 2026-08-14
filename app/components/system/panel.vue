<script lang="ts">
import type {
  PanelContext,
  PanelPassthrough,
  PanelProps,
  PanelSlots,
} from "#foundation/types/system/panel";
import type { Widgets } from "#foundation/types/widget";
import type { ComponentPublicInstance } from "vue";

import Group from "#foundation/components/common/group.vue";

import { computed, toValue, useTemplateRef } from "#imports";
import { PANEL_REGIONS } from "#foundation/constants/panel";
import { useWidgets, useWiring } from "#foundation/composables/widgets";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts" generic="R extends Widgets">
const { definition, pt } = defineProps<PanelProps<R>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const widgets = useWidgets(definition.widgets);
useWiring(definition.wire, widgets);

// Each fixed region paired with its resolved widget, if the definition assigns one.
const regions = computed(() =>
  PANEL_REGIONS.map((region) => {
    const assigned = definition.regions[region];
    const key = assigned === undefined ? undefined : String(assigned);
    return {
      region,
      key,
      widget: key === undefined ? undefined : widgets[key],
    };
  }),
);

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
  definition,
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
