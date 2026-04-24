<script lang="ts">
import type { CalendarProps } from "../types/calendar";
import type { DateValue } from "@internationalized/date";
import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
  CalendarPrev,
  CalendarNext,
} from "reka-ui";
</script>

<script setup lang="ts">
const {
  pt,
  minValue,
  maxValue,
  locale,
  numberOfMonths = 1,
  fixedWeeks,
  disabled,
  isDateDisabled,
  isDateUnavailable,
} = defineProps<CalendarProps>();

const model = defineModel<DateValue>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, {
  props: { minValue, maxValue, locale, numberOfMonths, fixedWeeks, disabled, isDateDisabled, isDateUnavailable },
});
const headerPT = usePassthrough(pt?.header, {});
const headingPT = usePassthrough(pt?.heading, {});
const gridPT = usePassthrough(pt?.grid, {});
const cellPT = usePassthrough(pt?.cell, {});
const cellTriggerPT = usePassthrough(pt?.cellTrigger, {});
const prevPT = usePassthrough(pt?.prev, {});
const nextPT = usePassthrough(pt?.next, {});

const ctx = computed(() => ({
  minValue,
  maxValue,
  locale,
  numberOfMonths,
  fixedWeeks,
  disabled,
  isDateDisabled,
  isDateUnavailable,
  model: model.value,
}));
</script>

<template>
  <CalendarRoot
    ref="el"
    v-slot="{ weekDays, grid }"
    v-model="model"
    v-bind="rootPT.props"
    v-on="rootPT.handlers"
    class="f-calendar"
  >
    <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
      <CalendarHeader v-bind="headerPT.props" v-on="headerPT.handlers" class="f-calendar-header">
        <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
          <CalendarPrev v-bind="prevPT.props" v-on="prevPT.handlers" class="f-calendar-nav">
            <Icon alias="chevron-left" />
          </CalendarPrev>
        </slot>
        <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
          <CalendarHeading v-bind="headingPT.props" v-on="headingPT.handlers" class="f-calendar-heading" />
        </slot>
        <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
          <CalendarNext v-bind="nextPT.props" v-on="nextPT.handlers" class="f-calendar-nav">
            <Icon alias="chevron-right" />
          </CalendarNext>
        </slot>
      </CalendarHeader>
    </slot>
    <slot v-for="month in grid" name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
      <CalendarGrid :key="month.value.toString()" v-bind="gridPT.props" v-on="gridPT.handlers" class="f-calendar-grid">
        <CalendarGridHead>
          <CalendarGridRow class="f-calendar-row">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="f-calendar-head-cell"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow
            v-for="(week, i) in month.rows"
            :key="i"
            class="f-calendar-row"
          >
            <slot v-for="date in week" name="cell" v-bind="{ ...ctx, month, date }">
              <CalendarCell
                :key="date.toString()"
                v-bind="cellPT.props"
                v-on="cellPT.handlers"
                :date="date"
                class="f-calendar-cell"
              >
                <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                  <CalendarCellTrigger
                    v-bind="cellTriggerPT.props"
                    v-on="cellTriggerPT.handlers"
                    :day="date"
                    :month="month.value"
                    class="f-calendar-cell-trigger"
                  />
                </slot>
              </CalendarCell>
            </slot>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </slot>
  </CalendarRoot>
</template>
