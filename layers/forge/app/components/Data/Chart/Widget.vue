<script lang="ts">
import type { DataChartProps } from "../../../types/data-chart-widget";
</script>

<script setup lang="ts" generic="T">
const { chart, pt } = defineProps<DataChartProps<T>>();

useLazyAsyncData(`init-chart-${useId()}`, chart.init, { server: false });

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ chart }));
const variant = computed(() => chart.activeVariantConfig.value);

// Popover state
const variantOpen = ref(false);
const fieldOpen = ref(false);
const xOpen = ref(false);
const yOpen = ref(false);
const bucketOpen = ref(false);
const rendererOpen = ref(false);

// Command groups — active items are disabled
const variantGroups = computed(() => [{
  key: "variants",
  items: chart.variants.map((v) => ({
    value: v.type,
    label: v.type.charAt(0).toUpperCase() + v.type.slice(1),
    disabled: v.type === chart.activeVariant.value,
  })),
}]);

const fieldGroups = computed(() => [{
  key: "fields",
  items: variant.value.fields.map((f) => ({
    value: String(f),
    label: String(f),
    disabled: variant.value.type === "distribution"
      ? false
      : String(f) === String(chart.activeField.value),
  })),
}]);

const xFieldGroups = computed(() => [{
  key: "fields",
  items: variant.value.fields.map((f) => ({
    value: String(f),
    label: String(f),
    disabled: String(f) === String(chart.activeX.value),
  })),
}]);

const yFieldGroups = computed(() => [{
  key: "fields",
  items: variant.value.fields.map((f) => ({
    value: String(f),
    label: String(f),
    disabled: String(f) === String(chart.activeY.value),
  })),
}]);

const bucketGroups = computed(() => {
  const v = variant.value;
  if (v.type !== "series") return [];
  return [{
    key: "buckets",
    items: v.buckets.map((b) => ({
      value: b,
      label: b,
      disabled: b === chart.activeBucket.value,
    })),
  }];
});

const rendererGroups = computed(() => [{
  key: "renderers",
  items: variant.value.renderers.map((r) => ({
    value: r.type,
    label: r.label ?? r.type,
    disabled: r.type === chart.activeRenderer.value,
  })),
}]);

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const toolbarPT = usePassthrough(pt?.toolbar, { props: {}, handlers: {} });
const titlePT = usePassthrough(pt?.title, { props: {}, handlers: {} });
const actionsPT = usePassthrough(pt?.actions, { props: {}, handlers: {} });
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-chart"
    v-on="rootPT.handlers"
  >
    <slot name="toolbar" v-bind="ctx">
      <Group
        v-bind="toolbarPT.props"
        class="f-data-chart-toolbar"
        v-on="toolbarPT.handlers"
      >
        <!-- Title — variant selector -->
        <Group
          v-bind="titlePT.props"
          class="f-data-chart-title"
          v-on="titlePT.handlers"
        >
          <Popover
            :open="variantOpen"
            align="start"
            @update:open="variantOpen = $event"
          >
            <template #trigger>
              <Button class="f-data-chart-title-btn">
                {{ chart.title.value }}
                <Icon :alias="('chevron-down' as IconAlias)" />
              </Button>
            </template>
            <template #content>
              <Command
                :groups="variantGroups"
                @select="chart.setVariant($event); variantOpen = false"
                @keydown.escape="variantOpen = false"
              />
            </template>
          </Popover>
        </Group>

        <!-- Actions — fab row -->
        <Group
          v-bind="actionsPT.props"
          class="f-data-chart-actions"
          v-on="actionsPT.handlers"
        >
          <!-- Field selector: breakdown + series -->
          <Popover
            v-if="variant.type === 'breakdown' || variant.type === 'series'"
            :open="fieldOpen"
            align="end"
            @update:open="fieldOpen = $event"
          >
            <template #trigger>
              <Fab :icon="('layers' as IconAlias)" />
            </template>
            <template #content>
              <Command
                :groups="fieldGroups"
                placeholder="Field..."
                @select="chart.setField($event as keyof T); fieldOpen = false"
                @keydown.escape="fieldOpen = false"
              />
            </template>
          </Popover>

          <!-- X field: distribution -->
          <Popover
            v-if="variant.type === 'distribution'"
            :open="xOpen"
            align="end"
            @update:open="xOpen = $event"
          >
            <template #trigger>
              <Fab :icon="('arrow-right' as IconAlias)" :label="'X'" />
            </template>
            <template #content>
              <Command
                :groups="xFieldGroups"
                placeholder="X axis..."
                @select="chart.setX($event as keyof T); xOpen = false"
                @keydown.escape="xOpen = false"
              />
            </template>
          </Popover>

          <!-- Y field: distribution -->
          <Popover
            v-if="variant.type === 'distribution'"
            :open="yOpen"
            align="end"
            @update:open="yOpen = $event"
          >
            <template #trigger>
              <Fab :icon="('arrow-up' as IconAlias)" :label="'Y'" />
            </template>
            <template #content>
              <Command
                :groups="yFieldGroups"
                placeholder="Y axis..."
                @select="chart.setY($event as keyof T); yOpen = false"
                @keydown.escape="yOpen = false"
              />
            </template>
          </Popover>

          <!-- Bucket selector: series -->
          <Popover
            v-if="variant.type === 'series'"
            :open="bucketOpen"
            align="end"
            @update:open="bucketOpen = $event"
          >
            <template #trigger>
              <Fab :icon="('schedule' as IconAlias)" />
            </template>
            <template #content>
              <Command
                :groups="bucketGroups"
                @select="chart.setBucket($event as any); bucketOpen = false"
                @keydown.escape="bucketOpen = false"
              />
            </template>
          </Popover>

          <!-- Chart type selector -->
          <Popover
            :open="rendererOpen"
            align="end"
            @update:open="rendererOpen = $event"
          >
            <template #trigger>
              <Fab :icon="('bar-chart' as IconAlias)" />
            </template>
            <template #content>
              <Command
                :groups="rendererGroups"
                @select="chart.setRenderer($event); rendererOpen = false"
                @keydown.escape="rendererOpen = false"
              />
            </template>
          </Popover>
        </Group>
      </Group>
    </slot>

    <slot v-if="chart.loading.value" name="loading" v-bind="ctx" />

    <slot
      v-else-if="!chart.variantData.value"
      name="empty"
      v-bind="ctx"
    />

    <DataChartCanvas
      v-else
      :chart="chart"
      :pt="pt?.canvas"
    />
  </Group>
</template>
