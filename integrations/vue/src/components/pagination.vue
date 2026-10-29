<script lang="ts">
import type {
  PaginationProps,
  PaginationEmits,
  PaginationPassthrough,
  PaginationContext,
  PaginationSlots,
} from "../types/components/pagination";

import Fab from "./fab.vue";
import Select from "./select.vue";

import Primitive from "./primitive.vue";

import { useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from "../constants/pagination";
import { usePaginate } from "../composables/paginate";
</script>

<script setup lang="ts">
const { page, size, count, total, pt } = defineProps<PaginationProps>();

const emit = defineEmits<PaginationEmits>();

const $page = useModel(
  () => page,
  (v) => emit("update:page", v),
  { default: 1 },
);

const $size = useModel(
  () => size,
  (v) => emit("update:size", v),
  { default: PAGE_SIZE_DEFAULT },
);

const el = useTemplateRef<HTMLDivElement>("el");

const { hasPrev, hasNext, options, first, prev, next, last, goToPage } =
  usePaginate($page, () => count);

const settings = usePassthrough<PaginationPassthrough>(() => ({
  pt,
  recipes: {
    first: {
      as: Fab,
      label: "First",
      disabled: !hasPrev.value,
      onClick: first,
    },
    prev: {
      as: Fab,
      label: "Previous",
      disabled: !hasPrev.value,
      onClick: prev,
    },
    next: { as: Fab, label: "Next", disabled: !hasNext.value, onClick: next },
    last: { as: Fab, label: "Last", disabled: !hasNext.value, onClick: last },
    size: {
      as: Select,
      modelValue: PAGE_SIZE_OPTIONS.find(
        (o) => o.value === String($size.value),
      ),
      options: PAGE_SIZE_OPTIONS,
      "onUpdate:modelValue": (v) => {
        $size.value = Number(v.value);
      },
    },
  },
}));

const ctx = useContext<PaginationContext>("pagination", () => ({
  page: $page,
  size: $size,
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
          <Primitive v-bind="settings.first">
            <template v-if="$slots.firstPrepend" #prepend>
              <slot name="firstPrepend" v-bind="ctx" />
            </template>
            <template v-if="$slots.firstAppend" #append>
              <slot name="firstAppend" v-bind="ctx" />
            </template>
          </Primitive>
        </slot>
        <slot name="prev" v-bind="ctx">
          <Primitive v-bind="settings.prev">
            <template v-if="$slots.prevPrepend" #prepend>
              <slot name="prevPrepend" v-bind="ctx" />
            </template>
            <template v-if="$slots.prevAppend" #append>
              <slot name="prevAppend" v-bind="ctx" />
            </template>
          </Primitive>
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
          <Primitive v-bind="settings.next">
            <template v-if="$slots.nextPrepend" #prepend>
              <slot name="nextPrepend" v-bind="ctx" />
            </template>
            <template v-if="$slots.nextAppend" #append>
              <slot name="nextAppend" v-bind="ctx" />
            </template>
          </Primitive>
        </slot>
        <slot name="last" v-bind="ctx">
          <Primitive v-bind="settings.last">
            <template v-if="$slots.lastPrepend" #prepend>
              <slot name="lastPrepend" v-bind="ctx" />
            </template>
            <template v-if="$slots.lastAppend" #append>
              <slot name="lastAppend" v-bind="ctx" />
            </template>
          </Primitive>
        </slot>
      </div>
    </slot>
    <slot name="size" v-bind="ctx">
      <Primitive v-bind="settings.size" />
    </slot>
  </div>
</template>
