<script lang="ts">
import type {
  DatePickerProps,
  DatePickerEmits,
  DatePickerPassthrough,
  DatePickerContext,
  DatePickerSlots,
} from "../../types/core/date-picker";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance } from "vue";

import {
  DatePickerRoot,
  DatePickerField,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerCalendar,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerPrev,
  DatePickerNext,
  DatePickerGrid,
  DatePickerGridHead,
  DatePickerGridBody,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerCell,
  DatePickerCellTrigger,
} from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import { DATE_PICKER_SIDE_OFFSET } from "../../constants/date-picker";
</script>

<script setup lang="ts">
const {
  modelValue,
  open = undefined,
  disabled,
  pt,
} = defineProps<DatePickerProps>();

const emit = defineEmits<DatePickerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateValue | undefined>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const settings = usePassthrough<DatePickerPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      open: $open.value,
      disabled,
      "onUpdate:modelValue": (v) => {
        $model.value = v;
      },
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    field: {},
    input: (segment) => ({ part: segment.part }),
    trigger: {},
    content: { sideOffset: DATE_PICKER_SIDE_OFFSET },
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

const ctx = useContext<DatePickerContext>("date-picker", () => ({
  disabled,
  modelValue: $model,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerSlots>();
</script>

<template>
  <DatePickerRoot ref="el" class="f-date-picker-root" v-bind="settings.root">
    <DatePickerField class="f-date-picker-field" v-bind="settings.field">
      <template #default="{ segments }">
        <slot name="field" v-bind="{ ...ctx, segments }">
          <template v-for="segment in segments" :key="segment.part">
            <slot name="input" v-bind="{ ...ctx, segment }">
              <DatePickerInput class="f-date-picker-input" v-bind="settings.input(segment)">
                {{ segment.value }}
              </DatePickerInput>
            </slot>
          </template>
          <slot name="trigger" v-bind="ctx">
            <DatePickerTrigger class="f-date-picker-trigger" v-bind="settings.trigger">
              <slot name="triggerIcon" v-bind="ctx">
                <Icon class="f-icon" fill="currentColor" name="calendar" />
              </slot>
            </DatePickerTrigger>
          </slot>
        </slot>
      </template>
    </DatePickerField>
    <slot name="content" v-bind="ctx">
      <DatePickerContent class="f-date-picker-content" v-bind="settings.content">
        <DatePickerCalendar class="f-date-picker-calendar" v-bind="settings.calendar">
          <template #default="{ weekDays, grid }">
            <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
              <DatePickerHeader class="f-date-picker-header" v-bind="settings.header">
                <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
                  <DatePickerPrev class="f-date-picker-prev" v-bind="settings.prev">
                    <slot name="prevIcon" v-bind="{ ...ctx, weekDays, grid }">
                      <Icon class="f-icon" fill="currentColor" name="chevron-left" />
                    </slot>
                  </DatePickerPrev>
                </slot>
                <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
                  <DatePickerHeading class="f-date-picker-heading" v-bind="settings.heading" />
                </slot>
                <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
                  <DatePickerNext class="f-date-picker-next" v-bind="settings.next">
                    <slot name="nextIcon" v-bind="{ ...ctx, weekDays, grid }">
                      <Icon class="f-icon" fill="currentColor" name="chevron-right" />
                    </slot>
                  </DatePickerNext>
                </slot>
              </DatePickerHeader>
            </slot>
            <template v-for="month in grid" :key="month.value.toString()">
              <slot name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
                <DatePickerGrid class="f-date-picker-grid" v-bind="settings.grid">
                  <slot name="gridHead" v-bind="{ ...ctx, weekDays, grid, month }">
                    <DatePickerGridHead class="f-date-picker-grid-head" v-bind="settings.gridHead">
                      <DatePickerGridRow class="f-date-picker-grid-row" v-bind="settings.gridRow">
                        <template v-for="day in weekDays" :key="day">
                          <slot name="headCell" v-bind="{ ...ctx, day }">
                            <DatePickerHeadCell class="f-date-picker-head-cell" v-bind="settings.headCell">
                              {{ day }}
                            </DatePickerHeadCell>
                          </slot>
                        </template>
                      </DatePickerGridRow>
                    </DatePickerGridHead>
                  </slot>
                  <slot name="gridBody" v-bind="{ ...ctx, weekDays, grid, month }">
                    <DatePickerGridBody class="f-date-picker-grid-body" v-bind="settings.gridBody">
                      <DatePickerGridRow
                        v-for="(week, i) in month.rows"
                        :key="i"
                        class="f-date-picker-grid-row"
                        v-bind="settings.gridRow"
                      >
                        <template v-for="date in week" :key="date.toString()">
                          <slot name="cell" v-bind="{ ...ctx, month, date }">
                            <DatePickerCell class="f-date-picker-cell" v-bind="settings.cell(date)">
                              <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                                <DatePickerCellTrigger
                                  class="f-date-picker-cell-trigger"
                                  v-bind="settings.cellTrigger({ day: date, month: month.value })"
                                />
                              </slot>
                            </DatePickerCell>
                          </slot>
                        </template>
                      </DatePickerGridRow>
                    </DatePickerGridBody>
                  </slot>
                </DatePickerGrid>
              </slot>
            </template>
          </template>
        </DatePickerCalendar>
      </DatePickerContent>
    </slot>
  </DatePickerRoot>
</template>
