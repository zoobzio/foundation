<script setup lang="ts">
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

const {
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
</script>

<template>
  <RangeCalendarRoot
    v-model="model"
    v-slot="{ weekDays, grid }"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :number-of-months="numberOfMonths"
    :fixed-weeks="fixedWeeks"
    :disabled="disabled"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    class="f-calendar f-calendar--range"
  >
    <RangeCalendarHeader class="f-calendar-header">
      <RangeCalendarPrev class="f-calendar-nav">
        <Icon alias="chevron-left" />
      </RangeCalendarPrev>
      <RangeCalendarHeading class="f-calendar-heading" />
      <RangeCalendarNext class="f-calendar-nav">
        <Icon alias="chevron-right" />
      </RangeCalendarNext>
    </RangeCalendarHeader>
    <div class="f-calendar-grids">
      <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()" class="f-calendar-grid">
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
            <RangeCalendarCell
              v-for="date in week"
              :key="date.toString()"
              :date="date"
              class="f-calendar-cell"
            >
              <RangeCalendarCellTrigger
                :day="date"
                :month="month.value"
                class="f-calendar-cell-trigger"
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
