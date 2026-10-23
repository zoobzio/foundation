<script lang="ts">
import type {
  DirectoryContext,
  DirectoryEmits,
  DirectoryItem,
  DirectoryPassthrough,
  DirectoryProps,
  DirectorySlots,
} from "@zoobzio/vue/types/components/directory";
import type { Context } from "@zoobzio/vue/types/context";
import type { Passthrough } from "@zoobzio/vue/types/passthrough";
import type { VNodeProps } from "vue";

import Core from "@zoobzio/vue/components/directory.vue";

import NuxtLink from "#app/components/nuxt-link";
import { shallowRef, useAttrs } from "vue";
import { useContext } from "@zoobzio/vue/composables/context";
import { useExplicit } from "@zoobzio/vue/composables/explicit";
import { useForward } from "@zoobzio/vue/composables/forward";
import { usePassthrough } from "@zoobzio/vue/composables/passthrough";
</script>

<script setup lang="ts" generic="T extends DirectoryItem">
defineOptions({ inheritAttrs: false });

const props = defineProps<DirectoryProps<T>>();

const emit = defineEmits<DirectoryEmits<T>>();

const slots = defineSlots<DirectorySlots<T>>();

const attrs = useAttrs();

const explicit = useExplicit(props);

const el = shallowRef<{ ctx: Context<DirectoryContext<T>> } | null>(null);

const pt = usePassthrough<DirectoryPassthrough<T>>(() => ({
  pt: props.pt,
  layer: { link: () => ({ as: NuxtLink }) },
}));

const ctx = useContext(() => el.value?.ctx);

const Directory = useForward<
  Passthrough<DirectoryProps<T>, DirectoryEmits<T>> & VNodeProps
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
  <Directory />
</template>
