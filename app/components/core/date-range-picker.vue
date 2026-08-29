<script lang="ts">
import type {
  DateRangePickerProps,
  DateRangePickerEmits,
  DateRangePickerPassthrough,
  DateRangePickerContext,
  DateRangePickerSlots,
} from "../../types/core/date-range-picker";
import type { DateRange } from "reka-ui";
import type { ComponentPublicInstance } from "vue";

import {
  DateRangePickerRoot,
  DateRangePickerField,
  DateRangePickerInput,
  DateRangePickerTrigger,
  DateRangePickerContent,
  DateRangePickerCalendar,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerPrev,
  DateRangePickerNext,
  DateRangePickerGrid,
  DateRangePickerGridHead,
  DateRangePickerGridBody,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
} from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import {
  DATE_RANGE_PICKER_NUMBER_OF_MONTHS,
  DATE_RANGE_PICKER_SIDE_OFFSET,
} from "../../constants/date-range-picker";
</script>

<script setup lang="ts">
const {
  modelValue,
  open = undefined,
  pt,
} = defineProps<DateRangePickerProps>();

const emit = defineEmits<DateRangePickerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateRange | undefined>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const settings = usePassthrough<DateRangePickerPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      open: $open.value,
      numberOfMonths: DATE_RANGE_PICKER_NUMBER_OF_MONTHS,
      "onUpdate:modelValue": (v) => {
        $model.value = v;
      },
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    field: {},
    input: ({ segment, type }) => ({ part: segment.part, type }),
    trigger: {},
    content: { sideOffset: DATE_RANGE_PICKER_SIDE_OFFSET },
    calendar: {},
    header: {},
    prev: {},
    heading: {},
    next: {},
    grid: {},
    gridHead: {},
    gridBody: {},
    gridRow: {},
    headCell: {},
    cell: (date) => ({ date }),
    cellTrigger: ({ day, month }) => ({ day, month }),
  },
}));

const ctx = useContext<DateRangePickerContext>("date-range-picker", () => ({
  modelValue: $model,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerSlots>();
</script>

<template>
  <DateRangePickerRoot ref="el" class="f-date-range-picker-root" v-bind="settings.root">
    <DateRangePickerField class="f-date-range-picker-field" v-bind="settings.field">
      <template #default="{ segments }">
        <slot name="field" v-bind="{ ...ctx, segments }">
          <template v-for="segment in segments.start" :key="'start-' + segment.part">
            <slot name="input" v-bind="{ ...ctx, segment, type: 'start' }">
              <DateRangePickerInput
                class="f-date-range-picker-input"
                v-bind="settings.input({ segment, type: 'start' })"
              >
                {{ segment.value }}
              </DateRangePickerInput>
            </slot>
          </template>
          <slot name="separator" v-bind="ctx">
            <em class="f-em">-</em>
          </slot>
          <template v-for="segment in segments.end" :key="'end-' + segment.part">
            <slot name="input" v-bind="{ ...ctx, segment, type: 'end' }">
              <DateRangePickerInput
                class="f-date-range-picker-input"
                v-bind="settings.input({ segment, type: 'end' })"
              >
                {{ segment.value }}
              </DateRangePickerInput>
            </slot>
          </template>
          <slot name="trigger" v-bind="ctx">
            <DateRangePickerTrigger class="f-date-range-picker-trigger" v-bind="settings.trigger">
              <slot name="triggerIcon" v-bind="ctx">
                <Icon class="f-icon" fill="currentColor" name="calendar" />
              </slot>
            </DateRangePickerTrigger>
          </slot>
        </slot>
      </template>
    </DateRangePickerField>
    <slot name="content" v-bind="ctx">
      <DateRangePickerContent class="f-date-range-picker-content" v-bind="settings.content">
        <DateRangePickerCalendar class="f-date-range-picker-calendar" v-bind="settings.calendar">
          <template #default="{ weekDays, grid }">
            <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
              <DateRangePickerHeader class="f-date-range-picker-header" v-bind="settings.header">
                <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
                  <DateRangePickerPrev class="f-date-range-picker-prev" v-bind="settings.prev">
                    <slot name="prevIcon" v-bind="{ ...ctx, weekDays, grid }">
                      <Icon class="f-icon" fill="currentColor" name="chevron-left" />
                    </slot>
                  </DateRangePickerPrev>
                </slot>
                <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
                  <DateRangePickerHeading class="f-date-range-picker-heading" v-bind="settings.heading" />
                </slot>
                <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
                  <DateRangePickerNext class="f-date-range-picker-next" v-bind="settings.next">
                    <slot name="nextIcon" v-bind="{ ...ctx, weekDays, grid }">
                      <Icon class="f-icon" fill="currentColor" name="chevron-right" />
                    </slot>
                  </DateRangePickerNext>
                </slot>
              </DateRangePickerHeader>
            </slot>
            <template v-for="month in grid" :key="month.value.toString()">
              <slot name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
                <DateRangePickerGrid class="f-date-range-picker-grid" v-bind="settings.grid">
                  <slot name="gridHead" v-bind="{ ...ctx, weekDays, grid, month }">
                    <DateRangePickerGridHead class="f-date-range-picker-grid-head" v-bind="settings.gridHead">
                      <DateRangePickerGridRow class="f-date-range-picker-grid-row" v-bind="settings.gridRow">
                        <template v-for="day in weekDays" :key="day">
                          <slot name="headCell" v-bind="{ ...ctx, day }">
                            <DateRangePickerHeadCell class="f-date-range-picker-head-cell" v-bind="settings.headCell">
                              {{ day }}
                            </DateRangePickerHeadCell>
                          </slot>
                        </template>
                      </DateRangePickerGridRow>
                    </DateRangePickerGridHead>
                  </slot>
                  <slot name="gridBody" v-bind="{ ...ctx, weekDays, grid, month }">
                    <DateRangePickerGridBody class="f-date-range-picker-grid-body" v-bind="settings.gridBody">
                      <DateRangePickerGridRow
                        v-for="(week, i) in month.rows"
                        :key="i"
                        class="f-date-range-picker-grid-row"
                        v-bind="settings.gridRow"
                      >
                        <template v-for="date in week" :key="date.toString()">
                          <slot name="cell" v-bind="{ ...ctx, month, date }">
                            <DateRangePickerCell class="f-date-range-picker-cell" v-bind="settings.cell(date)">
                              <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                                <DateRangePickerCellTrigger
                                  class="f-date-range-picker-cell-trigger"
                                  v-bind="settings.cellTrigger({ day: date, month: month.value })"
                                />
                              </slot>
                            </DateRangePickerCell>
                          </slot>
                        </template>
                      </DateRangePickerGridRow>
                    </DateRangePickerGridBody>
                  </slot>
                </DateRangePickerGrid>
              </slot>
            </template>
          </template>
        </DateRangePickerCalendar>
      </DateRangePickerContent>
    </slot>
  </DateRangePickerRoot>
</template>
