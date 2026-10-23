<script lang="ts">
import type {
  TabsContext,
  TabsEmits,
  TabsOption,
  TabsPassthrough,
  TabsProps,
  TabsSlots,
} from "@zoobzio/vue/types/components/tabs";
import type { Context } from "@zoobzio/vue/types/context";
import type { Passthrough } from "@zoobzio/vue/types/passthrough";
import type { VNodeProps } from "vue";

import Core from "@zoobzio/vue/components/tabs.vue";

import NuxtLink from "#app/components/nuxt-link";
import { shallowRef, useAttrs } from "vue";
import { useContext } from "@zoobzio/vue/composables/context";
import { useExplicit } from "@zoobzio/vue/composables/explicit";
import { useForward } from "@zoobzio/vue/composables/forward";
import { usePassthrough } from "@zoobzio/vue/composables/passthrough";
</script>

<script setup lang="ts" generic="T extends TabsOption">
defineOptions({ inheritAttrs: false });

const props = defineProps<TabsProps<T>>();

const emit = defineEmits<TabsEmits>();

const slots = defineSlots<TabsSlots<T>>();

const attrs = useAttrs();

const explicit = useExplicit(props);

const el = shallowRef<{ ctx: Context<TabsContext<T>> } | null>(null);

const pt = usePassthrough<TabsPassthrough<T>>(() => ({
  pt: props.pt,
  layer: { link: () => ({ as: NuxtLink }) },
}));

const ctx = useContext(() => el.value?.ctx);

const Tabs = useForward<Passthrough<TabsProps<T>, TabsEmits> & VNodeProps>({
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
  <Tabs />
</template>
