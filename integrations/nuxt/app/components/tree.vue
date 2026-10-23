<script lang="ts">
import type {
  TreeContext,
  TreeEmits,
  TreeNode,
  TreePassthrough,
  TreeProps,
  TreeSlots,
} from "@zoobzio/vue/types/components/tree";
import type { Context } from "@zoobzio/vue/types/context";
import type { Passthrough } from "@zoobzio/vue/types/passthrough";
import type { VNodeProps } from "vue";

import Core from "@zoobzio/vue/components/tree.vue";

import NuxtLink from "#app/components/nuxt-link";
import { shallowRef, useAttrs } from "vue";
import { useContext } from "@zoobzio/vue/composables/context";
import { useExplicit } from "@zoobzio/vue/composables/explicit";
import { useForward } from "@zoobzio/vue/composables/forward";
import { usePassthrough } from "@zoobzio/vue/composables/passthrough";
</script>

<script setup lang="ts" generic="T extends TreeNode & { children?: T[] }">
defineOptions({ inheritAttrs: false });

const props = defineProps<TreeProps<T>>();

const emit = defineEmits<TreeEmits<T>>();

const slots = defineSlots<TreeSlots<T>>();

const attrs = useAttrs();

const explicit = useExplicit(props);

const el = shallowRef<{ ctx: Context<TreeContext<T>> } | null>(null);

const pt = usePassthrough<TreePassthrough<T>>(() => ({
  pt: props.pt,
  layer: { link: () => ({ as: NuxtLink }) },
}));

const ctx = useContext(() => el.value?.ctx);

const Tree = useForward<Passthrough<TreeProps<T>, TreeEmits<T>> & VNodeProps>({
  component: Core,
  props: () => ({
    ...attrs,
    ...explicit.value,
    pt: pt.value,
    ref: el,
    "onUpdate:modelValue": (value: T | undefined) =>
      emit("update:modelValue", value),
    "onUpdate:expanded": (value: string[]) => emit("update:expanded", value),
    onSelect: (node: T) => emit("select", node),
    onToggle: (node: T, expanded: boolean) => emit("toggle", node, expanded),
  }),
  slots,
});

defineExpose({ ctx });
</script>

<template>
  <Tree />
</template>
