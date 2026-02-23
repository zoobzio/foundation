<script setup lang="ts">
import { SplitterGroup, SplitterPanel } from "reka-ui";
import type { DashboardConfig, WidgetConfig } from "../../types/dashboard";
import { widgetRegistry } from "../../utils/widgetRegistry";

defineProps<{
  config: DashboardConfig;
}>();

const resolveWidget = (widget: WidgetConfig) => {
  const component = widgetRegistry.resolve(widget.variant);
  if (!component) {
    console.warn(`Widget variant "${widget.variant}" not found in registry`);
    return null;
  }
  return { component, props: widget.props ?? {} };
};
</script>

<template>
  <SplitterGroup :direction="config.direction" class="f-dashboard-grid">
    <SplitterPanel
      v-for="panel in config.panels"
      :key="panel.id"
      :id="panel.id"
      :default-size="panel.size"
      :min-size="panel.minSize"
      class="f-dashboard-panel"
    >
      <DataDashboard v-if="panel.nested" :config="panel.nested" />
      <template v-else-if="panel.widget">
        <component
          :is="resolveWidget(panel.widget)?.component"
          v-bind="resolveWidget(panel.widget)?.props"
        />
      </template>
    </SplitterPanel>
  </SplitterGroup>
</template>
