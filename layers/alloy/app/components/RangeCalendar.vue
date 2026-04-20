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
  <RangeCalendarRoot
    ref="el"
    v-slot="{ weekDays, grid }"
    v-model="model"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :number-of-months="numberOfMonths"
    :fixed-weeks="fixedWeeks"
    :disabled="disabled"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    v-bind="pt?.root"
    class="f-calendar f-calendar--range"
  >
    <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
      <RangeCalendarHeader v-bind="pt?.header" class="f-calendar-header">
        <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
          <RangeCalendarPrev v-bind="pt?.prev" class="f-calendar-nav">
            <Icon alias="chevron-left" />
          </RangeCalendarPrev>
        </slot>
        <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
          <RangeCalendarHeading v-bind="pt?.heading" class="f-calendar-heading" />
        </slot>
        <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
          <RangeCalendarNext v-bind="pt?.next" class="f-calendar-nav">
            <Icon alias="chevron-right" />
          </RangeCalendarNext>
        </slot>
      </RangeCalendarHeader>
    </slot>
    <Group class="f-calendar-grids">
      <slot v-for="month in grid" name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
        <RangeCalendarGrid :key="month.value.toString()" v-bind="pt?.grid" class="f-calendar-grid">
          <RangeCalendarGridHead>
            <RangeCalendarGridRow class="f-calendar-row">
              <RangeCalendarHeadCell
                v-for="day in weekDays"
                :key="day"
                class="f-calendar-head-cell"
              >
                {{ day }}
              </RangeCalendarHeadCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridHead>
          <RangeCalendarGridBody>
            <RangeCalendarGridRow
              v-for="(week, i) in month.rows"
              :key="i"
              class="f-calendar-row"
            >
              <slot v-for="date in week" name="cell" v-bind="{ ...ctx, month, date }">
                <RangeCalendarCell
                  :key="date.toString()"
                  :date="date"
                  v-bind="pt?.cell"
                  class="f-calendar-cell"
                >
                  <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                    <RangeCalendarCellTrigger
                      :day="date"
                      :month="month.value"
                      v-bind="pt?.cellTrigger"
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
