<script lang="ts">
import type {
  CalendarProps,
  CalendarEmits,
  CalendarPassthrough,
  CalendarContext,
  CalendarSlots,
} from "../../types/core/calendar";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance } from "vue";

import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarPrev,
  CalendarNext,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
} from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { modelValue, maxValue, pt } = defineProps<CalendarProps>();

const emit = defineEmits<CalendarEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateValue | undefined>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const settings = usePassthrough<CalendarPassthrough>(() => ({
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

const ctx = useContext<CalendarContext>("calendar", () => ({
  maxValue,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<CalendarSlots>();
</script>

<template>
  <CalendarRoot ref="el" class="f-calendar-root" v-bind="settings.root">
    <template #default="{ weekDays, grid }">
      <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
        <CalendarHeader class="f-calendar-header" v-bind="settings.header">
          <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
            <CalendarPrev class="f-calendar-prev" v-bind="settings.prev">
              <slot name="prevIcon" v-bind="{ ...ctx, weekDays, grid }">
                <Icon class="f-icon" fill="currentColor" name="chevron-left" />
              </slot>
            </CalendarPrev>
          </slot>
          <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
            <CalendarHeading class="f-calendar-heading" v-bind="settings.heading" />
          </slot>
          <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
            <CalendarNext class="f-calendar-next" v-bind="settings.next">
              <slot name="nextIcon" v-bind="{ ...ctx, weekDays, grid }">
                <Icon class="f-icon" fill="currentColor" name="chevron-right" />
              </slot>
            </CalendarNext>
          </slot>
        </CalendarHeader>
      </slot>
      <template v-for="month in grid" :key="month.value.toString()">
        <slot name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
          <CalendarGrid class="f-calendar-grid" v-bind="settings.grid">
            <slot name="gridHead" v-bind="{ ...ctx, weekDays, grid, month }">
              <CalendarGridHead class="f-calendar-grid-head" v-bind="settings.gridHead">
                <CalendarGridRow class="f-calendar-grid-row" v-bind="settings.gridRow">
                  <template v-for="day in weekDays" :key="day">
                    <slot name="headCell" v-bind="{ ...ctx, day }">
                      <CalendarHeadCell class="f-calendar-head-cell" v-bind="settings.headCell">
                        {{ day }}
                      </CalendarHeadCell>
                    </slot>
                  </template>
                </CalendarGridRow>
              </CalendarGridHead>
            </slot>
            <slot name="gridBody" v-bind="{ ...ctx, weekDays, grid, month }">
              <CalendarGridBody class="f-calendar-grid-body" v-bind="settings.gridBody">
                <CalendarGridRow
                  v-for="(week, i) in month.rows"
                  :key="i"
                  class="f-calendar-grid-row"
                  v-bind="settings.gridRow"
                >
                  <template v-for="date in week" :key="date.toString()">
                    <slot name="cell" v-bind="{ ...ctx, month, date }">
                      <CalendarCell class="f-calendar-cell" v-bind="settings.cell(date)">
                        <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                          <CalendarCellTrigger
                            class="f-calendar-cell-trigger"
                            v-bind="settings.cellTrigger({ day: date, month: month.value })"
                          />
                        </slot>
                      </CalendarCell>
                    </slot>
                  </template>
                </CalendarGridRow>
              </CalendarGridBody>
            </slot>
          </CalendarGrid>
        </slot>
      </template>
    </template>
  </CalendarRoot>
</template>
