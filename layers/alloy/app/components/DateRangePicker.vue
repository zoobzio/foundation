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

const rootPT = usePassthrough(pt?.root, {
  props: { minValue, maxValue, locale, disabled, numberOfMonths },
});
const contentPT = usePassthrough(pt?.content, {
  props: { sideOffset: 8 },
});
const headerPT = usePassthrough(pt?.header, {});
const headingPT = usePassthrough(pt?.heading, {});
const gridPT = usePassthrough(pt?.grid, {});
const cellPT = usePassthrough(pt?.cell, {});
const cellTriggerPT = usePassthrough(pt?.cellTrigger, {});
const prevPT = usePassthrough(pt?.prev, {});
const nextPT = usePassthrough(pt?.next, {});

const ctx = computed(() => ({
  minValue, maxValue, locale, disabled, numberOfMonths,
  model: model.value,
}));
</script>

<template>
  <DateRangePickerRoot
    ref="el"
    v-model="model"
    v-bind="rootPT.props"
    v-on="rootPT.handlers"
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
      <DateRangePickerContent v-bind="contentPT.props" v-on="contentPT.handlers" class="f-date-picker-content">
        <DateRangePickerCalendar v-slot="{ weekDays, grid }" class="f-calendar f-calendar--range">
          <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
            <DateRangePickerHeader v-bind="headerPT.props" v-on="headerPT.handlers" class="f-calendar-header">
              <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
                <DateRangePickerPrev v-bind="prevPT.props" v-on="prevPT.handlers" class="f-calendar-nav">
                  <Icon alias="chevron-left" />
                </DateRangePickerPrev>
              </slot>
              <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
                <DateRangePickerHeading v-bind="headingPT.props" v-on="headingPT.handlers" class="f-calendar-heading" />
              </slot>
              <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
                <DateRangePickerNext v-bind="nextPT.props" v-on="nextPT.handlers" class="f-calendar-nav">
                  <Icon alias="chevron-right" />
                </DateRangePickerNext>
              </slot>
            </DateRangePickerHeader>
          </slot>
          <Group class="f-calendar-grids">
            <slot v-for="month in grid" name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
              <DateRangePickerGrid :key="month.value.toString()" v-bind="gridPT.props" v-on="gridPT.handlers" class="f-calendar-grid">
                <DateRangePickerGridHead>
                  <DateRangePickerGridRow class="f-calendar-row">
                    <DateRangePickerHeadCell v-for="day in weekDays" :key="day" class="f-calendar-head-cell">
                      {{ day }}
                    </DateRangePickerHeadCell>
                  </DateRangePickerGridRow>
                </DateRangePickerGridHead>
                <DateRangePickerGridBody>
                  <DateRangePickerGridRow v-for="(week, i) in month.rows" :key="i" class="f-calendar-row">
                    <slot v-for="date in week" name="cell" v-bind="{ ...ctx, month, date }">
                      <DateRangePickerCell
                        :key="date.toString()"
                        v-bind="cellPT.props"
                        v-on="cellPT.handlers"
                        :date="date"
                        class="f-calendar-cell"
                      >
                        <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                          <DateRangePickerCellTrigger
                            v-bind="cellTriggerPT.props"
                            v-on="cellTriggerPT.handlers"
                            :day="date"
                            :month="month.value"
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
