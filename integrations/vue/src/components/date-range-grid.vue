<script lang="ts">
import type {
  DateRangeGridProps,
  DateRangeGridEmits,
  DateRangeGridPassthrough,
  DateRangeGridContext,
  DateRangeGridSlots,
} from "../types/components/date-range-grid";
import type { DateRange } from "reka-ui";
import type { ComponentPublicInstance } from "vue";

import {
  RangeCalendarRoot,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarPrev,
  RangeCalendarNext,
  RangeCalendarGrid,
  RangeCalendarGridHead,
  RangeCalendarGridBody,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
} from "reka-ui";

import { useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";
</script>

<script setup lang="ts">
const { modelValue, maxValue, pt } = defineProps<DateRangeGridProps>();

const emit = defineEmits<DateRangeGridEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateRange | undefined>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const settings = usePassthrough<DateRangeGridPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      maxValue,
      "onUpdate:modelValue": (v) => {
        $model.value = v;
      },
    },
    header: {},
    prev: {},
    heading: {},
    next: {},
    grid: {},
    gridHead: {},
    gridBody: {},
    gridRow: {},
    headCell: {},
    cell: (date) => ({ date }),
    cellTrigger: ({ day, month }) => ({ day, month }),
  },
}));

const ctx = useContext<DateRangeGridContext>("date-range-grid", () => ({
  maxValue,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<DateRangeGridSlots>();
</script>

<template>
  <RangeCalendarRoot
    ref="el"
    class="f-date-range-grid-root"
    v-bind="settings.root"
  >
    <template #default="{ weekDays, grid }">
      <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
        <RangeCalendarHeader
          class="f-date-range-grid-header"
          v-bind="settings.header"
        >
          <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
            <RangeCalendarPrev
              class="f-date-range-grid-prev"
              v-bind="settings.prev"
            >
              <slot name="prevPrepend" v-bind="{ ...ctx, weekDays, grid }" />
              <span class="f-span">Previous</span>
              <slot name="prevAppend" v-bind="{ ...ctx, weekDays, grid }" />
            </RangeCalendarPrev>
          </slot>
          <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
            <RangeCalendarHeading
              class="f-date-range-grid-heading"
              v-bind="settings.heading"
            />
          </slot>
          <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
            <RangeCalendarNext
              class="f-date-range-grid-next"
              v-bind="settings.next"
            >
              <slot name="nextPrepend" v-bind="{ ...ctx, weekDays, grid }" />
              <span class="f-span">Next</span>
              <slot name="nextAppend" v-bind="{ ...ctx, weekDays, grid }" />
            </RangeCalendarNext>
          </slot>
        </RangeCalendarHeader>
      </slot>
      <template v-for="month in grid" :key="month.value.toString()">
        <slot name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
          <RangeCalendarGrid
            class="f-date-range-grid-grid"
            v-bind="settings.grid"
          >
            <slot name="gridHead" v-bind="{ ...ctx, weekDays, grid, month }">
              <RangeCalendarGridHead
                class="f-date-range-grid-grid-head"
                v-bind="settings.gridHead"
              >
                <RangeCalendarGridRow
                  class="f-date-range-grid-grid-row"
                  v-bind="settings.gridRow"
                >
                  <template v-for="day in weekDays" :key="day">
                    <slot name="headCell" v-bind="{ ...ctx, day }">
                      <RangeCalendarHeadCell
                        class="f-date-range-grid-head-cell"
                        v-bind="settings.headCell"
                      >
                        {{ day }}
                      </RangeCalendarHeadCell>
                    </slot>
                  </template>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
            </slot>
            <slot name="gridBody" v-bind="{ ...ctx, weekDays, grid, month }">
              <RangeCalendarGridBody
                class="f-date-range-grid-grid-body"
                v-bind="settings.gridBody"
              >
                <RangeCalendarGridRow
                  v-for="(week, i) in month.rows"
                  :key="i"
                  class="f-date-range-grid-grid-row"
                  v-bind="settings.gridRow"
                >
                  <template v-for="date in week" :key="date.toString()">
                    <slot name="cell" v-bind="{ ...ctx, month, date }">
                      <RangeCalendarCell
                        class="f-date-range-grid-cell"
                        v-bind="settings.cell(date)"
                      >
                        <slot
                          name="cellTrigger"
                          v-bind="{ ...ctx, month, date }"
                        >
                          <RangeCalendarCellTrigger
                            class="f-date-range-grid-cell-trigger"
                            v-bind="
                              settings.cellTrigger({
                                day: date,
                                month: month.value,
                              })
                            "
                          />
                        </slot>
                      </RangeCalendarCell>
                    </slot>
                  </template>
                </RangeCalendarGridRow>
              </RangeCalendarGridBody>
            </slot>
          </RangeCalendarGrid>
        </slot>
      </template>
    </template>
  </RangeCalendarRoot>
</template>
