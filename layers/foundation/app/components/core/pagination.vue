<script lang="ts">
import type {
  PaginationProps,
  PaginationEmits,
  PaginationPassthrough,
  PaginationContext,
  PaginationSlots,
} from "../../types/core/pagination";

import Fab from "./fab.vue";
import Select from "./select.vue";

import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import { PAGE_SIZE_OPTIONS } from "../../constants/pagination";
import { usePaginate } from "../../composables/paginate";
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

const el = useTemplateRef<HTMLDivElement>("el");

const { hasPrev, hasNext, options, first, prev, next, last, goToPage } =
  usePaginate(currentPage, () => count);

const settings = usePassthrough<PaginationPassthrough>(() => ({
  pt,
  recipes: {
    first: { label: "First", disabled: !hasPrev.value, onClick: first },
    prev: { label: "Previous", disabled: !hasPrev.value, onClick: prev },
    next: { label: "Next", disabled: !hasNext.value, onClick: next },
    last: { label: "Last", disabled: !hasNext.value, onClick: last },
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
  <div ref="el" class="f-group">
    <slot name="info" v-bind="ctx">
      <span class="f-span">
        Page {{ page }} of {{ count }} ({{ total }} results)
      </span>
    </slot>
    <slot name="pages" v-bind="ctx">
      <div class="f-group">
        <slot name="first" v-bind="ctx">
          <Fab v-bind="settings.first">
            <template v-if="$slots.firstIcon" #icon>
              <slot name="firstIcon" v-bind="ctx" />
            </template>
          </Fab>
        </slot>
        <slot name="prev" v-bind="ctx">
          <Fab v-bind="settings.prev">
            <template v-if="$slots.prevIcon" #icon>
              <slot name="prevIcon" v-bind="ctx" />
            </template>
          </Fab>
        </slot>
        <slot name="options" v-bind="ctx">
          <div class="f-group">
            <template v-for="option in options" :key="option">
              <slot name="option" v-bind="{ ...ctx, option }">
                <button
                  type="button"
                  class="f-button"
                  :disabled="option === '...' || option === page"
                  :aria-current="option === page ? 'page' : undefined"
                  @click="typeof option === 'number' && goToPage(option)"
                >
                  {{ option }}
                </button>
              </slot>
            </template>
          </div>
        </slot>
        <slot name="next" v-bind="ctx">
          <Fab v-bind="settings.next">
            <template v-if="$slots.nextIcon" #icon>
              <slot name="nextIcon" v-bind="ctx" />
            </template>
          </Fab>
        </slot>
        <slot name="last" v-bind="ctx">
          <Fab v-bind="settings.last">
            <template v-if="$slots.lastIcon" #icon>
              <slot name="lastIcon" v-bind="ctx" />
            </template>
          </Fab>
        </slot>
      </div>
    </slot>
    <slot name="size" v-bind="ctx">
      <Select v-bind="settings.size" />
    </slot>
  </div>
</template>
