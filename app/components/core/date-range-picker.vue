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

import DateRangePickerRoot from "../common/date-range-picker/root.vue";
import DateRangePickerField from "../common/date-range-picker/field.vue";
import DateRangePickerInput from "../common/date-range-picker/input.vue";
import DateRangePickerTrigger from "../common/date-range-picker/trigger.vue";
import DateRangePickerContent from "../common/date-range-picker/content.vue";
import DateRangePickerCalendar from "../common/date-range-picker/calendar.vue";
import DateRangePickerHeader from "../common/date-range-picker/header.vue";
import DateRangePickerHeading from "../common/date-range-picker/heading.vue";
import DateRangePickerPrev from "../common/date-range-picker/prev.vue";
import DateRangePickerNext from "../common/date-range-picker/next.vue";
import DateRangePickerGrid from "../common/date-range-picker/grid.vue";
import DateRangePickerGridHead from "../common/date-range-picker/grid-head.vue";
import DateRangePickerGridBody from "../common/date-range-picker/grid-body.vue";
import DateRangePickerGridRow from "../common/date-range-picker/grid-row.vue";
import DateRangePickerHeadCell from "../common/date-range-picker/head-cell.vue";
import DateRangePickerCell from "../common/date-range-picker/cell.vue";
import DateRangePickerCellTrigger from "../common/date-range-picker/cell-trigger.vue";
import Em from "../common/em.vue";
import Icon from "../common/icon.vue";

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
    separator: {},
    trigger: {},
    triggerIcon: { alias: "calendar" },
    content: { sideOffset: DATE_RANGE_PICKER_SIDE_OFFSET },
    calendar: {},
    header: {},
    prev: {},
    prevIcon: { alias: "chevron-left" },
    heading: {},
    next: {},
    nextIcon: { alias: "chevron-right" },
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
  <DateRangePickerRoot ref="el" v-bind="settings.root">
    <DateRangePickerField v-bind="settings.field">
      <template #default="{ segments }">
        <slot name="field" v-bind="{ ...ctx, segments }">
          <template v-for="segment in segments.start" :key="'start-' + segment.part">
            <slot name="input" v-bind="{ ...ctx, segment, type: 'start' }">
              <DateRangePickerInput v-bind="settings.input({ segment, type: 'start' })">
                {{ segment.value }}
              </DateRangePickerInput>
            </slot>
          </template>
          <slot name="separator" v-bind="ctx">
            <Em v-bind="settings.separator">-</Em>
          </slot>
          <template v-for="segment in segments.end" :key="'end-' + segment.part">
            <slot name="input" v-bind="{ ...ctx, segment, type: 'end' }">
              <DateRangePickerInput v-bind="settings.input({ segment, type: 'end' })">
                {{ segment.value }}
              </DateRangePickerInput>
            </slot>
          </template>
          <slot name="trigger" v-bind="ctx">
            <DateRangePickerTrigger v-bind="settings.trigger">
              <slot name="triggerIcon" v-bind="ctx">
                <Icon v-bind="settings.triggerIcon" />
              </slot>
            </DateRangePickerTrigger>
          </slot>
        </slot>
      </template>
    </DateRangePickerField>
    <slot name="content" v-bind="ctx">
      <DateRangePickerContent v-bind="settings.content">
        <DateRangePickerCalendar v-bind="settings.calendar">
          <template #default="{ weekDays, grid }">
            <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
              <DateRangePickerHeader v-bind="settings.header">
                <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
                  <DateRangePickerPrev v-bind="settings.prev">
                    <slot name="prevIcon" v-bind="{ ...ctx, weekDays, grid }">
                      <Icon v-bind="settings.prevIcon" />
                    </slot>
                  </DateRangePickerPrev>
                </slot>
                <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
                  <DateRangePickerHeading v-bind="settings.heading" />
                </slot>
                <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
                  <DateRangePickerNext v-bind="settings.next">
                    <slot name="nextIcon" v-bind="{ ...ctx, weekDays, grid }">
                      <Icon v-bind="settings.nextIcon" />
                    </slot>
                  </DateRangePickerNext>
                </slot>
              </DateRangePickerHeader>
            </slot>
            <template v-for="month in grid" :key="month.value.toString()">
              <slot name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
                <DateRangePickerGrid v-bind="settings.grid">
                  <slot name="gridHead" v-bind="{ ...ctx, weekDays, grid, month }">
                    <DateRangePickerGridHead v-bind="settings.gridHead">
                      <DateRangePickerGridRow v-bind="settings.gridRow">
                        <template v-for="day in weekDays" :key="day">
                          <slot name="headCell" v-bind="{ ...ctx, day }">
                            <DateRangePickerHeadCell v-bind="settings.headCell">
                              {{ day }}
                            </DateRangePickerHeadCell>
                          </slot>
                        </template>
                      </DateRangePickerGridRow>
                    </DateRangePickerGridHead>
                  </slot>
                  <slot name="gridBody" v-bind="{ ...ctx, weekDays, grid, month }">
                    <DateRangePickerGridBody v-bind="settings.gridBody">
                      <DateRangePickerGridRow
                        v-for="(week, i) in month.rows"
                        :key="i"
                        v-bind="settings.gridRow"
                      >
                        <template v-for="date in week" :key="date.toString()">
                          <slot name="cell" v-bind="{ ...ctx, month, date }">
                            <DateRangePickerCell v-bind="settings.cell(date)">
                              <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                                <DateRangePickerCellTrigger
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
