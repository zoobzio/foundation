<script lang="ts">
import type { AdapterWidgetProps } from "../../../types/data/adapter/widget";
import type { AnyWidget } from "../../../types/widget";

import { computed } from "#imports";
</script>

<script setup lang="ts" generic="P extends object">
const { service, pt } = defineProps<AdapterWidgetProps<P>>();

// Erased render view, structure-style: the props/component correlation was
// proven where the factory captured them, so the bind is unchecked here.
const view = computed((): AnyWidget["component"] => service.component);

// Erased bind: captured settings under the service's patch overrides, then
// each declared emit's listener wrapped so the captured handler and the
// hook-bus bridge both fire.
const bindings = computed(() => {
  const merged: Record<string, unknown> = {};
  Object.assign(merged, pt, service.props);
  for (const emit of service.emits) {
    const key = `on${emit.charAt(0).toUpperCase()}${emit.slice(1)}`;
    const captured = merged[key];
    merged[key] = (...args: unknown[]) => {
      if (typeof captured === "function") captured(...args);
      service.emitted(emit, args);
    };
  }
  return merged;
});
</script>

<template>
  <component :is="view" v-bind="bindings" />
</template>
