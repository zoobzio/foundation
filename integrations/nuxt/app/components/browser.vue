<script lang="ts">
import type {
  BrowserContext,
  BrowserCrumbItem,
  BrowserEmits,
  BrowserProps,
  BrowserSlots,
} from "@zoobzio/vue/types/components/browser";
import type { BreadcrumbPassthrough } from "@zoobzio/vue/types/components/breadcrumb";
import type { BrowserFilesPassthrough } from "@zoobzio/vue/types/components/browser-files";
import type { Context } from "@zoobzio/vue/types/context";
import type { Passthrough } from "@zoobzio/vue/types/passthrough";
import type { VNodeProps } from "vue";

import Core from "@zoobzio/vue/components/browser.vue";

import NuxtLink from "#app/components/nuxt-link";
import { shallowRef, useAttrs } from "vue";
import { useContext } from "@zoobzio/vue/composables/context";
import { useExplicit } from "@zoobzio/vue/composables/explicit";
import { useForward } from "@zoobzio/vue/composables/forward";
import { usePassthrough } from "@zoobzio/vue/composables/passthrough";

type BrowserUpdated = BrowserEmits<unknown>["updated"][0];
type BrowserNavigated = BrowserEmits<unknown>["navigated"][0];
</script>

<script setup lang="ts" generic="T">
defineOptions({ inheritAttrs: false });

const props = defineProps<BrowserProps<T>>();

const emit = defineEmits<BrowserEmits<T>>();

const slots = defineSlots<BrowserSlots<T>>();

const attrs = useAttrs();

const explicit = useExplicit(props);

const el = shallowRef<{ ctx: Context<BrowserContext<T>> } | null>(null);

const files = usePassthrough<BrowserFilesPassthrough<T>>(() => ({
  pt: props.pt?.files,
  layer: { link: () => ({ as: NuxtLink }) },
}));

const crumbs = usePassthrough<BreadcrumbPassthrough<BrowserCrumbItem>>(() => ({
  pt: props.pt?.breadcrumb?.pt,
  layer: { link: () => ({ as: NuxtLink }) },
}));

const ctx = useContext(() => el.value?.ctx);

const Browser = useForward<
  Passthrough<BrowserProps<T>, BrowserEmits<T>> & VNodeProps
>({
  component: Core,
  props: () => ({
    ...attrs,
    ...explicit.value,
    pt: {
      ...props.pt,
      files: files.value,
      breadcrumb: { ...props.pt?.breadcrumb, pt: crumbs.value },
    },
    ref: el,
    onUpdated: (event: BrowserUpdated) => emit("updated", event),
    onNavigated: (event: BrowserNavigated) => emit("navigated", event),
  }),
  slots,
});

defineExpose({ ctx });
</script>

<template>
  <Browser />
</template>
