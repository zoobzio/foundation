<script setup lang="ts">
import type { DatePickerProps } from "../types/date-picker";
import type { DateValue } from "@internationalized/date";
import {
  DatePickerRoot,
  DatePickerField,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerCalendar,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerGrid,
  DatePickerGridHead,
  DatePickerGridBody,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerPrev,
  DatePickerNext,
} from "reka-ui";

const {
  placeholder = "Select date",
  minValue,
  maxValue,
  locale,
  disabled,
  granularity = "day",
  isDateDisabled,
} = defineProps<DatePickerProps>();

const model = defineModel<DateValue>();
</script>

<template>
  <DatePickerRoot
    v-model="model"
    v-slot="{ weekDays, grid }"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :disabled="disabled"
    :granularity="granularity"
    :is-date-disabled="isDateDisabled"
    class="f-date-picker"
  >
    <DatePickerField v-slot="{ segments }" class="f-date-picker-field">
      <template v-for="segment in segments" :key="segment.part">
        <DatePickerInput
          v-if="segment.part === 'literal'"
          :part="segment.part"
          class="f-date-picker-literal"
        >
          {{ segment.value }}
        </DatePickerInput>
        <DatePickerInput
          v-else
          :part="segment.part"
          class="f-date-picker-segment"
        >
          {{ segment.value }}
        </DatePickerInput>
      </template>
      <DatePickerTrigger class="f-date-picker-trigger">
        <Icon alias="calendar" />
      </DatePickerTrigger>
    </DatePickerField>
    <DatePickerContent class="f-date-picker-content" :side-offset="8">
      <DatePickerCalendar v-slot="{ weekDays, grid }" class="f-calendar">
        <DatePickerHeader class="f-calendar-header">
          <DatePickerPrev class="f-calendar-nav">
            <Icon alias="chevron-left" />
          </DatePickerPrev>
          <DatePickerHeading class="f-calendar-heading" />
          <DatePickerNext class="f-calendar-nav">
            <Icon alias="chevron-right" />
          </DatePickerNext>
        </DatePickerHeader>
        <DatePickerGrid v-for="month in grid" :key="month.value.toString()" class="f-calendar-grid">
          <DatePickerGridHead>
            <DatePickerGridRow class="f-calendar-row">
              <DatePickerHeadCell
                v-for="day in weekDays"
                :key="day"
                class="f-calendar-head-cell"
              >
                {{ day }}
              </DatePickerHeadCell>
            </DatePickerGridRow>
          </DatePickerGridHead>
          <DatePickerGridBody>
            <DatePickerGridRow
              v-for="(week, i) in month.rows"
              :key="i"
              class="f-calendar-row"
            >
              <DatePickerCell
                v-for="date in week"
                :key="date.toString()"
                :date="date"
                class="f-calendar-cell"
              >
                <DatePickerCellTrigger
                  :day="date"
                  :month="month.value"
                  class="f-calendar-cell-trigger"
                />
              </DatePickerCell>
            </DatePickerGridRow>
          </DatePickerGridBody>
        </DatePickerGrid>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>
