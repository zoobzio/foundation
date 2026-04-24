<script lang="ts">
import type { RangeCalendarProps } from "../types/range-calendar";
import type { DateRange } from "../types/date-range-picker";
import {
  RangeCalendarRoot,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarGrid,
  RangeCalendarGridHead,
  RangeCalendarGridBody,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarPrev,
  RangeCalendarNext,
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
} = defineProps<RangeCalendarProps>();

const model = defineModel<DateRange>();

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
  minValue, maxValue, locale, numberOfMonths, fixedWeeks, disabled, isDateDisabled, isDateUnavailable,
  model: model.value,
}));
</script>

<template>
  <RangeCalendarRoot
    ref="el"
    v-slot="{ weekDays, grid }"
    v-model="model"
    v-bind="rootPT.props"
    v-on="rootPT.handlers"
    class="f-calendar f-calendar--range"
  >
    <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
      <RangeCalendarHeader v-bind="headerPT.props" v-on="headerPT.handlers" class="f-calendar-header">
        <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
          <RangeCalendarPrev v-bind="prevPT.props" v-on="prevPT.handlers" class="f-calendar-nav">
            <Icon alias="chevron-left" />
          </RangeCalendarPrev>
        </slot>
        <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
          <RangeCalendarHeading v-bind="headingPT.props" v-on="headingPT.handlers" class="f-calendar-heading" />
        </slot>
        <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
          <RangeCalendarNext v-bind="nextPT.props" v-on="nextPT.handlers" class="f-calendar-nav">
            <Icon alias="chevron-right" />
          </RangeCalendarNext>
        </slot>
      </RangeCalendarHeader>
    </slot>
    <Group class="f-calendar-grids">
      <slot v-for="month in grid" name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
        <RangeCalendarGrid :key="month.value.toString()" v-bind="gridPT.props" v-on="gridPT.handlers" class="f-calendar-grid">
          <RangeCalendarGridHead>
            <RangeCalendarGridRow class="f-calendar-row">
              <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="f-calendar-head-cell">
                {{ day }}
              </RangeCalendarHeadCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridHead>
          <RangeCalendarGridBody>
            <RangeCalendarGridRow v-for="(week, i) in month.rows" :key="i" class="f-calendar-row">
              <slot v-for="date in week" name="cell" v-bind="{ ...ctx, month, date }">
                <RangeCalendarCell
                  :key="date.toString()"
                  v-bind="cellPT.props"
                  v-on="cellPT.handlers"
                  :date="date"
                  class="f-calendar-cell"
                >
                  <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                    <RangeCalendarCellTrigger
                      v-bind="cellTriggerPT.props"
                      v-on="cellTriggerPT.handlers"
                      :day="date"
                      :month="month.value"
                      class="f-calendar-cell-trigger"
                    />
                  </slot>
                </RangeCalendarCell>
              </slot>
            </RangeCalendarGridRow>
          </RangeCalendarGridBody>
        </RangeCalendarGrid>
      </slot>
    </Group>
  </RangeCalendarRoot>
</template>
