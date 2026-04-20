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
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :number-of-months="numberOfMonths"
    :fixed-weeks="fixedWeeks"
    :disabled="disabled"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    v-bind="pt?.root"
    class="f-calendar"
  >
    <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
      <CalendarHeader v-bind="pt?.header" class="f-calendar-header">
        <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
          <CalendarPrev v-bind="pt?.prev" class="f-calendar-nav">
            <Icon alias="chevron-left" />
          </CalendarPrev>
        </slot>
        <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
          <CalendarHeading v-bind="pt?.heading" class="f-calendar-heading" />
        </slot>
        <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
          <CalendarNext v-bind="pt?.next" class="f-calendar-nav">
            <Icon alias="chevron-right" />
          </CalendarNext>
        </slot>
      </CalendarHeader>
    </slot>
    <slot v-for="month in grid" name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
      <CalendarGrid :key="month.value.toString()" v-bind="pt?.grid" class="f-calendar-grid">
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
                :date="date"
                v-bind="pt?.cell"
                class="f-calendar-cell"
              >
                <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                  <CalendarCellTrigger
                    :day="date"
                    :month="month.value"
                    v-bind="pt?.cellTrigger"
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
