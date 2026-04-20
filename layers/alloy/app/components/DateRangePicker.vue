<script lang="ts">
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
</script>

<script setup lang="ts">
const {
  pt,
  minValue,
  maxValue,
  locale,
  disabled,
  numberOfMonths = 2,
} = defineProps<DateRangePickerProps>();

const model = defineModel<DateRange>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({
  minValue,
  maxValue,
  locale,
  disabled,
  numberOfMonths,
  model: model.value,
}));
</script>

<template>
  <DateRangePickerRoot
    ref="el"
    v-model="model"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :disabled="disabled"
    :number-of-months="numberOfMonths"
    v-bind="pt?.root"
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
      <Em class="f-date-picker-separator">-</Em>
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
    <slot name="content" v-bind="{ ...ctx }">
      <DateRangePickerContent v-bind="pt?.content" class="f-date-picker-content" :side-offset="8">
        <DateRangePickerCalendar v-slot="{ weekDays, grid }" class="f-calendar f-calendar--range">
          <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
            <DateRangePickerHeader v-bind="pt?.header" class="f-calendar-header">
              <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
                <DateRangePickerPrev v-bind="pt?.prev" class="f-calendar-nav">
                  <Icon alias="chevron-left" />
                </DateRangePickerPrev>
              </slot>
              <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
                <DateRangePickerHeading v-bind="pt?.heading" class="f-calendar-heading" />
              </slot>
              <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
                <DateRangePickerNext v-bind="pt?.next" class="f-calendar-nav">
                  <Icon alias="chevron-right" />
                </DateRangePickerNext>
              </slot>
            </DateRangePickerHeader>
          </slot>
          <Group class="f-calendar-grids">
            <slot v-for="month in grid" name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
              <DateRangePickerGrid :key="month.value.toString()" v-bind="pt?.grid" class="f-calendar-grid">
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
                    <slot v-for="date in week" name="cell" v-bind="{ ...ctx, month, date }">
                      <DateRangePickerCell
                        :key="date.toString()"
                        :date="date"
                        v-bind="pt?.cell"
                        class="f-calendar-cell"
                      >
                        <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                          <DateRangePickerCellTrigger
                            :day="date"
                            :month="month.value"
                            v-bind="pt?.cellTrigger"
                            class="f-calendar-cell-trigger"
                          />
                        </slot>
                      </DateRangePickerCell>
                    </slot>
                  </DateRangePickerGridRow>
                </DateRangePickerGridBody>
              </DateRangePickerGrid>
            </slot>
          </Group>
        </DateRangePickerCalendar>
      </DateRangePickerContent>
    </slot>
  </DateRangePickerRoot>
</template>
