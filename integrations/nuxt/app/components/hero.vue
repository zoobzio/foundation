<script lang="ts">
import type {
  HeroContext,
  HeroEmits,
  HeroPassthrough,
  HeroProps,
  HeroSlots,
} from "@zoobzio/vue/types/components/hero";
import type { Context } from "@zoobzio/vue/types/context";
import type { Passthrough } from "@zoobzio/vue/types/passthrough";
import type { VNodeProps } from "vue";

import Core from "@zoobzio/vue/components/hero.vue";

import NuxtLink from "#app/components/nuxt-link";
import { shallowRef, useAttrs } from "vue";
import { useContext } from "@zoobzio/vue/composables/context";
import { useExplicit } from "@zoobzio/vue/composables/explicit";
import { useForward } from "@zoobzio/vue/composables/forward";
import { usePassthrough } from "@zoobzio/vue/composables/passthrough";
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = defineProps<HeroProps>();

const slots = defineSlots<HeroSlots>();

const attrs = useAttrs();

const explicit = useExplicit(props);

const el = shallowRef<{ ctx: Context<HeroContext> } | null>(null);

const pt = usePassthrough<HeroPassthrough>(() => ({
  pt: props.pt,
  layer: { link: { as: NuxtLink } },
}));

const ctx = useContext(() => el.value?.ctx);

const Hero = useForward<Passthrough<HeroProps, HeroEmits> & VNodeProps>({
  component: Core,
  props: () => ({
    ...attrs,
    ...explicit.value,
    pt: pt.value,
    ref: el,
  }),
  slots,
});

defineExpose({ ctx });
</script>

<template>
  <Hero />
</template>
