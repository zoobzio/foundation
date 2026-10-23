<script lang="ts">
import type {
  SegmentedControlContext,
  SegmentedControlEmits,
  SegmentedControlOption,
  SegmentedControlPassthrough,
  SegmentedControlProps,
  SegmentedControlSlots,
} from "@zoobzio/vue/types/components/segmented-control";
import type { Context } from "@zoobzio/vue/types/context";
import type { Passthrough } from "@zoobzio/vue/types/passthrough";
import type { VNodeProps } from "vue";

import Core from "@zoobzio/vue/components/segmented-control.vue";

import NuxtLink from "#app/components/nuxt-link";
import { shallowRef, useAttrs } from "vue";
import { useContext } from "@zoobzio/vue/composables/context";
import { useExplicit } from "@zoobzio/vue/composables/explicit";
import { useForward } from "@zoobzio/vue/composables/forward";
import { usePassthrough } from "@zoobzio/vue/composables/passthrough";
</script>

<script setup lang="ts" generic="T extends SegmentedControlOption">
defineOptions({ inheritAttrs: false });

const props = defineProps<SegmentedControlProps<T>>();

const emit = defineEmits<SegmentedControlEmits>();

const slots = defineSlots<SegmentedControlSlots<T>>();

const attrs = useAttrs();

const explicit = useExplicit(props);

const el = shallowRef<{ ctx: Context<SegmentedControlContext<T>> } | null>(
  null,
);

const pt = usePassthrough<SegmentedControlPassthrough<T>>(() => ({
  pt: props.pt,
  layer: { link: () => ({ as: NuxtLink }) },
}));

const ctx = useContext(() => el.value?.ctx);

const SegmentedControl = useForward<
  Passthrough<SegmentedControlProps<T>, SegmentedControlEmits> & VNodeProps
>({
  component: Core,
  props: () => ({
    ...attrs,
    ...explicit.value,
    pt: pt.value,
    ref: el,
    "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
  }),
  slots,
});

defineExpose({ ctx });
</script>

<template>
  <SegmentedControl />
</template>
