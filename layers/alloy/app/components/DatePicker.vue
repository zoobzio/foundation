<script lang="ts">
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
</script>

<script setup lang="ts">
const {
  pt,
  minValue,
  maxValue,
  locale,
  disabled,
  granularity = "day",
  isDateDisabled,
} = defineProps<DatePickerProps>();

const model = defineModel<DateValue>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({
  minValue,
  maxValue,
  locale,
  disabled,
  granularity,
  isDateDisabled,
  model: model.value,
}));
</script>

<template>
  <DatePickerRoot
    ref="el"
    v-model="model"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :disabled="disabled"
    :granularity="granularity"
    :is-date-disabled="isDateDisabled"
    v-bind="pt?.root"
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
    <slot name="content" v-bind="{ ...ctx }">
      <DatePickerContent v-bind="pt?.content" class="f-date-picker-content" :side-offset="8">
        <DatePickerCalendar v-slot="{ weekDays, grid }" class="f-calendar">
          <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
            <DatePickerHeader v-bind="pt?.header" class="f-calendar-header">
              <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
                <DatePickerPrev v-bind="pt?.prev" class="f-calendar-nav">
                  <Icon alias="chevron-left" />
                </DatePickerPrev>
              </slot>
              <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
                <DatePickerHeading v-bind="pt?.heading" class="f-calendar-heading" />
              </slot>
              <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
                <DatePickerNext v-bind="pt?.next" class="f-calendar-nav">
                  <Icon alias="chevron-right" />
                </DatePickerNext>
              </slot>
            </DatePickerHeader>
          </slot>
          <slot v-for="month in grid" name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
            <DatePickerGrid :key="month.value.toString()" v-bind="pt?.grid" class="f-calendar-grid">
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
                  <slot v-for="date in week" name="cell" v-bind="{ ...ctx, month, date }">
                    <DatePickerCell
                      :key="date.toString()"
                      :date="date"
                      v-bind="pt?.cell"
                      class="f-calendar-cell"
                    >
                      <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                        <DatePickerCellTrigger
                          :day="date"
                          :month="month.value"
                          v-bind="pt?.cellTrigger"
                          class="f-calendar-cell-trigger"
                        />
                      </slot>
                    </DatePickerCell>
                  </slot>
                </DatePickerGridRow>
              </DatePickerGridBody>
            </DatePickerGrid>
          </slot>
        </DatePickerCalendar>
      </DatePickerContent>
    </slot>
  </DatePickerRoot>
</template>
