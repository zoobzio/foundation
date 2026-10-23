<script lang="ts">
import type {
  TableContext,
  TableEmits,
  TableProps,
  TableSlots,
} from "@zoobzio/vue/types/components/table";
import type { TableBodyPassthrough } from "@zoobzio/vue/types/components/table-body";
import type { Context } from "@zoobzio/vue/types/context";
import type { Passthrough } from "@zoobzio/vue/types/passthrough";
import type { VNodeProps } from "vue";

import Core from "@zoobzio/vue/components/table.vue";

import NuxtLink from "#app/components/nuxt-link";
import { shallowRef, useAttrs } from "vue";
import { useContext } from "@zoobzio/vue/composables/context";
import { useExplicit } from "@zoobzio/vue/composables/explicit";
import { useForward } from "@zoobzio/vue/composables/forward";
import { usePassthrough } from "@zoobzio/vue/composables/passthrough";

type TableUpdated = TableEmits<unknown>["updated"][0];
type TableFiltered = TableEmits<unknown>["filtered"][0];
</script>

<script setup lang="ts" generic="T">
defineOptions({ inheritAttrs: false });

const props = defineProps<TableProps<T>>();

const emit = defineEmits<TableEmits<T>>();

const slots = defineSlots<TableSlots<T>>();

const attrs = useAttrs();

const explicit = useExplicit(props);

const el = shallowRef<{ ctx: Context<TableContext<T>> } | null>(null);

const body = usePassthrough<TableBodyPassthrough<T>>(() => ({
  pt: props.pt?.body,
  layer: { link: () => ({ as: NuxtLink }) },
}));

const ctx = useContext(() => el.value?.ctx);

const Table = useForward<
  Passthrough<TableProps<T>, TableEmits<T>> & VNodeProps
>({
  component: Core,
  props: () => ({
    ...attrs,
    ...explicit.value,
    pt: { ...props.pt, body: body.value },
    ref: el,
    onUpdated: (event: TableUpdated) => emit("updated", event),
    onFiltered: (event: TableFiltered) => emit("filtered", event),
  }),
  slots,
});

defineExpose({ ctx });
</script>

<template>
  <Table />
</template>
