<script setup lang="ts">
import type { DateRangePickerProps, DateRange } from "../types/date-range-picker";
import {
  DateRangePickerRoot,
  DateRangePickerField,
  DateRangePickerInput,
  DateRangePickerTrigger,
  DateRangePickerContent,
  DateRangePickerCalendar,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerGrid,
  DateRangePickerGridHead,
  DateRangePickerGridBody,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerPrev,
  DateRangePickerNext,
} from "reka-ui";

const {
  minValue,
  maxValue,
  locale,
  disabled,
  numberOfMonths = 2,
} = defineProps<DateRangePickerProps>();

const model = defineModel<DateRange>();
</script>

<template>
  <DateRangePickerRoot
    v-model="model"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :disabled="disabled"
    :number-of-months="numberOfMonths"
    class="f-date-range-picker"
  >
    <DateRangePickerField v-slot="{ segments }" class="f-date-picker-field">
      <template v-for="segment in segments.start" :key="'start-' + segment.part">
        <DateRangePickerInput
          v-if="segment.part === 'literal'"
          :part="segment.part"
          type="start"
          class="f-date-picker-literal"
        >
          {{ segment.value }}
        </DateRangePickerInput>
        <DateRangePickerInput
          v-else
          :part="segment.part"
          type="start"
          class="f-date-picker-segment"
        >
          {{ segment.value }}
        </DateRangePickerInput>
      </template>
      <span class="f-date-picker-separator">-</span>
      <template v-for="segment in segments.end" :key="'end-' + segment.part">
        <DateRangePickerInput
          v-if="segment.part === 'literal'"
          :part="segment.part"
          type="end"
          class="f-date-picker-literal"
        >
          {{ segment.value }}
        </DateRangePickerInput>
        <DateRangePickerInput
          v-else
          :part="segment.part"
          type="end"
          class="f-date-picker-segment"
        >
          {{ segment.value }}
        </DateRangePickerInput>
      </template>
      <DateRangePickerTrigger class="f-date-picker-trigger">
        <Icon alias="calendar" />
      </DateRangePickerTrigger>
    </DateRangePickerField>
    <DateRangePickerContent class="f-date-picker-content" :side-offset="8">
      <DateRangePickerCalendar v-slot="{ weekDays, grid }" class="f-calendar f-calendar--range">
        <DateRangePickerHeader class="f-calendar-header">
          <DateRangePickerPrev class="f-calendar-nav">
            <Icon alias="chevron-left" />
          </DateRangePickerPrev>
          <DateRangePickerHeading class="f-calendar-heading" />
          <DateRangePickerNext class="f-calendar-nav">
            <Icon alias="chevron-right" />
          </DateRangePickerNext>
        </DateRangePickerHeader>
        <div class="f-calendar-grids">
          <DateRangePickerGrid v-for="month in grid" :key="month.value.toString()" class="f-calendar-grid">
            <DateRangePickerGridHead>
              <DateRangePickerGridRow class="f-calendar-row">
                <DateRangePickerHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="f-calendar-head-cell"
                >
                  {{ day }}
                </DateRangePickerHeadCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridHead>
            <DateRangePickerGridBody>
              <DateRangePickerGridRow
                v-for="(week, i) in month.rows"
                :key="i"
                class="f-calendar-row"
              >
                <DateRangePickerCell
                  v-for="date in week"
                  :key="date.toString()"
                  :date="date"
                  class="f-calendar-cell"
                >
                  <DateRangePickerCellTrigger
                    :day="date"
                    :month="month.value"
                    class="f-calendar-cell-trigger"
                  />
                </DateRangePickerCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridBody>
          </DateRangePickerGrid>
        </div>
      </DateRangePickerCalendar>
    </DateRangePickerContent>
  </DateRangePickerRoot>
</template>
