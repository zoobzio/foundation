<script setup lang="ts">
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

const {
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
</script>

<template>
  <CalendarRoot
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
    class="f-calendar"
  >
    <CalendarHeader class="f-calendar-header">
      <CalendarPrev class="f-calendar-nav">
        <Icon alias="chevron-left" />
      </CalendarPrev>
      <CalendarHeading class="f-calendar-heading" />
      <CalendarNext class="f-calendar-nav">
        <Icon alias="chevron-right" />
      </CalendarNext>
    </CalendarHeader>
    <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="f-calendar-grid">
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
          <CalendarCell
            v-for="date in week"
            :key="date.toString()"
            :date="date"
            class="f-calendar-cell"
          >
            <CalendarCellTrigger
              :day="date"
              :month="month.value"
              class="f-calendar-cell-trigger"
            />
          </CalendarCell>
        </CalendarGridRow>
      </CalendarGridBody>
    </CalendarGrid>
  </CalendarRoot>
</template>
