<script lang="ts">
import type {
  BreadcrumbContext,
  BreadcrumbEmits,
  BreadcrumbItem,
  BreadcrumbPassthrough,
  BreadcrumbProps,
  BreadcrumbSlots,
} from "@zoobzio/vue/types/components/breadcrumb";
import type { Context } from "@zoobzio/vue/types/context";
import type { Passthrough } from "@zoobzio/vue/types/passthrough";
import type { VNodeProps } from "vue";

import Core from "@zoobzio/vue/components/breadcrumb.vue";

import NuxtLink from "#app/components/nuxt-link";
import { shallowRef, useAttrs } from "vue";
import { useContext } from "@zoobzio/vue/composables/context";
import { useExplicit } from "@zoobzio/vue/composables/explicit";
import { useForward } from "@zoobzio/vue/composables/forward";
import { usePassthrough } from "@zoobzio/vue/composables/passthrough";
</script>

<script setup lang="ts" generic="T extends BreadcrumbItem">
defineOptions({ inheritAttrs: false });

const props = defineProps<BreadcrumbProps<T>>();

const emit = defineEmits<BreadcrumbEmits<T>>();

const slots = defineSlots<BreadcrumbSlots<T>>();

const attrs = useAttrs();

const explicit = useExplicit(props);

const el = shallowRef<{ ctx: Context<BreadcrumbContext<T>> } | null>(null);

const pt = usePassthrough<BreadcrumbPassthrough<T>>(() => ({
  pt: props.pt,
  layer: { link: () => ({ as: NuxtLink }) },
}));

const ctx = useContext(() => el.value?.ctx);

const Breadcrumb = useForward<
  Passthrough<BreadcrumbProps<T>, BreadcrumbEmits<T>> & VNodeProps
>({
  component: Core,
  props: () => ({
    ...attrs,
    ...explicit.value,
    pt: pt.value,
    ref: el,
    onSelect: (item: T) => emit("select", item),
  }),
  slots,
});

defineExpose({ ctx });
</script>

<template>
  <Breadcrumb />
</template>
