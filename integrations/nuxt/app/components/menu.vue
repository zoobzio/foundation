<script lang="ts">
import type {
  MenuContext,
  MenuEmits,
  MenuItem,
  MenuPassthrough,
  MenuProps,
  MenuSlots,
} from "@zoobzio/vue/types/components/menu";
import type { Context } from "@zoobzio/vue/types/context";
import type { Passthrough } from "@zoobzio/vue/types/passthrough";
import type { VNodeProps } from "vue";

import Core from "@zoobzio/vue/components/menu.vue";

import NuxtLink from "#app/components/nuxt-link";
import { shallowRef, useAttrs } from "vue";
import { useContext } from "@zoobzio/vue/composables/context";
import { useExplicit } from "@zoobzio/vue/composables/explicit";
import { useForward } from "@zoobzio/vue/composables/forward";
import { usePassthrough } from "@zoobzio/vue/composables/passthrough";
</script>

<script setup lang="ts" generic="T extends MenuItem">
defineOptions({ inheritAttrs: false });

const props = defineProps<MenuProps<T>>();

const emit = defineEmits<MenuEmits<T>>();

const slots = defineSlots<MenuSlots<T>>();

const attrs = useAttrs();

const explicit = useExplicit(props);

const el = shallowRef<{ ctx: Context<MenuContext<T>> } | null>(null);

const pt = usePassthrough<MenuPassthrough<T>>(() => ({
  pt: props.pt,
  layer: { link: () => ({ as: NuxtLink }) },
}));

const ctx = useContext(() => el.value?.ctx);

const Menu = useForward<Passthrough<MenuProps<T>, MenuEmits<T>> & VNodeProps>({
  component: Core,
  props: () => ({
    ...attrs,
    ...explicit.value,
    pt: pt.value,
    ref: el,
    onSelect: (item: T) => emit("select", item),
    "onUpdate:open": (value: boolean) => emit("update:open", value),
  }),
  slots,
});

defineExpose({ ctx });
</script>

<template>
  <Menu />
</template>
