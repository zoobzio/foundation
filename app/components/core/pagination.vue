<script lang="ts">
import type {
  PaginationProps,
  PaginationEmits,
  PaginationPassthrough,
  PaginationContext,
  PaginationSlots,
} from "#foundation/types/core/pagination";
import type { ComponentPublicInstance } from "vue";

import Button from "#foundation/components/common/button.vue";
import Group from "#foundation/components/common/group.vue";
import Span from "#foundation/components/common/span.vue";
import Fab from "#foundation/components/core/fab.vue";
import Select from "#foundation/components/core/select.vue";

import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
import { PAGE_SIZE_OPTIONS } from "#foundation/constants/pagination";
import { usePaginate } from "#foundation/composables/paginate";
</script>

<script setup lang="ts">
const { page, size, count, total, pt } = defineProps<PaginationProps>();

const emit = defineEmits<PaginationEmits>();

const $page = useModel(
  () => page,
  (v) => emit("update:page", v),
);

const $size = useModel(
  () => size,
  (v) => emit("update:size", v),
);

// useModel widens to `number | undefined`; page/size are required props, so
// coerce to concrete `Ref<number>` for usePaginate and the ctx.
const currentPage = computed<number>({
  get: () => $page.value ?? 1,
  set: (v) => {
    $page.value = v;
  },
});
const currentSize = computed<number>({
  get: () => $size.value ?? size,
  set: (v) => {
    $size.value = v;
  },
});

const el = useTemplateRef<ComponentPublicInstance>("el");

const { hasPrev, hasNext, options, first, prev, next, last, goToPage } =
  usePaginate(currentPage, () => count);

const settings = usePassthrough<PaginationPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    info: {},
    pages: {},
    first: { icon: "chevron-first", disabled: !hasPrev.value, onClick: first },
    prev: { icon: "chevron-left", disabled: !hasPrev.value, onClick: prev },
    next: { icon: "chevron-right", disabled: !hasNext.value, onClick: next },
    last: { icon: "chevron-last", disabled: !hasNext.value, onClick: last },
    options: {},
    option: (p) => ({
      disabled: p === "..." || p === page,
      aria: p === page ? { current: "page" } : undefined,
      onClick: () => {
        if (typeof p === "number") goToPage(p);
      },
    }),
    size: {
      modelValue: PAGE_SIZE_OPTIONS.find(
        (o) => o.value === String(currentSize.value),
      ),
      options: PAGE_SIZE_OPTIONS,
      "onUpdate:modelValue": (v) => {
        currentSize.value = Number(v.value);
      },
    },
  },
}));

const ctx = useContext<PaginationContext>("pagination", () => ({
  page: currentPage,
  size: currentSize,
  count,
  total,
  hasPrev: hasPrev.value,
  hasNext: hasNext.value,
  options: options.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<PaginationSlots>();
</script>

<template>
  <Group ref="el" v-bind="settings.root">
    <slot name="info" v-bind="ctx">
      <Span v-bind="settings.info">
        Page {{ page }} of {{ count }} ({{ total }} results)
      </Span>
    </slot>
    <slot name="pages" v-bind="ctx">
      <Group v-bind="settings.pages">
        <slot name="first" v-bind="ctx">
          <Fab v-bind="settings.first" />
        </slot>
        <slot name="prev" v-bind="ctx">
          <Fab v-bind="settings.prev" />
        </slot>
        <slot name="options" v-bind="ctx">
          <Group v-bind="settings.options">
            <template v-for="option in options" :key="option">
              <slot name="option" v-bind="{ ...ctx, option }">
                <Button v-bind="settings.option(option)">{{ option }}</Button>
              </slot>
            </template>
          </Group>
        </slot>
        <slot name="next" v-bind="ctx">
          <Fab v-bind="settings.next" />
        </slot>
        <slot name="last" v-bind="ctx">
          <Fab v-bind="settings.last" />
        </slot>
      </Group>
    </slot>
    <slot name="size" v-bind="ctx">
      <Select v-bind="settings.size" />
    </slot>
  </Group>
</template>
