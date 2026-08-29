<script lang="ts">
import type {
  RangeCalendarProps,
  RangeCalendarEmits,
  RangeCalendarPassthrough,
  RangeCalendarContext,
  RangeCalendarSlots,
} from "../../types/core/range-calendar";
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

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { modelValue, maxValue, pt } = defineProps<RangeCalendarProps>();

const emit = defineEmits<RangeCalendarEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateRange | undefined>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const settings = usePassthrough<RangeCalendarPassthrough>(() => ({
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

const ctx = useContext<RangeCalendarContext>("calendar", () => ({
  maxValue,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarSlots>();
</script>

<template>
  <RangeCalendarRoot ref="el" class="f-range-calendar-root" v-bind="settings.root">
    <template #default="{ weekDays, grid }">
      <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
        <RangeCalendarHeader class="f-range-calendar-header" v-bind="settings.header">
          <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
            <RangeCalendarPrev class="f-range-calendar-prev" v-bind="settings.prev">
              <slot name="prevIcon" v-bind="{ ...ctx, weekDays, grid }">
                <Icon class="f-icon" fill="currentColor" name="chevron-left" />
              </slot>
            </RangeCalendarPrev>
          </slot>
          <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
            <RangeCalendarHeading class="f-range-calendar-heading" v-bind="settings.heading" />
          </slot>
          <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
            <RangeCalendarNext class="f-range-calendar-next" v-bind="settings.next">
              <slot name="nextIcon" v-bind="{ ...ctx, weekDays, grid }">
                <Icon class="f-icon" fill="currentColor" name="chevron-right" />
              </slot>
            </RangeCalendarNext>
          </slot>
        </RangeCalendarHeader>
      </slot>
      <template v-for="month in grid" :key="month.value.toString()">
        <slot name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
          <RangeCalendarGrid class="f-range-calendar-grid" v-bind="settings.grid">
            <slot name="gridHead" v-bind="{ ...ctx, weekDays, grid, month }">
              <RangeCalendarGridHead class="f-range-calendar-grid-head" v-bind="settings.gridHead">
                <RangeCalendarGridRow class="f-range-calendar-grid-row" v-bind="settings.gridRow">
                  <template v-for="day in weekDays" :key="day">
                    <slot name="headCell" v-bind="{ ...ctx, day }">
                      <RangeCalendarHeadCell class="f-range-calendar-head-cell" v-bind="settings.headCell">
                        {{ day }}
                      </RangeCalendarHeadCell>
                    </slot>
                  </template>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
            </slot>
            <slot name="gridBody" v-bind="{ ...ctx, weekDays, grid, month }">
              <RangeCalendarGridBody class="f-range-calendar-grid-body" v-bind="settings.gridBody">
                <RangeCalendarGridRow
                  v-for="(week, i) in month.rows"
                  :key="i"
                  class="f-range-calendar-grid-row"
                  v-bind="settings.gridRow"
                >
                  <template v-for="date in week" :key="date.toString()">
                    <slot name="cell" v-bind="{ ...ctx, month, date }">
                      <RangeCalendarCell class="f-range-calendar-cell" v-bind="settings.cell(date)">
                        <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                          <RangeCalendarCellTrigger
                            class="f-range-calendar-cell-trigger"
                            v-bind="settings.cellTrigger({ day: date, month: month.value })"
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
