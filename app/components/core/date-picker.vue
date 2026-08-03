<script lang="ts">
import type {
  DatePickerProps,
  DatePickerEmits,
  DatePickerPassthrough,
  DatePickerContext,
  DatePickerSlots,
} from "#foundation/types/core/date-picker";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance } from "vue";

import DatePickerRoot from "#foundation/components/common/date-picker/root.vue";
import DatePickerField from "#foundation/components/common/date-picker/field.vue";
import DatePickerInput from "#foundation/components/common/date-picker/input.vue";
import DatePickerTrigger from "#foundation/components/common/date-picker/trigger.vue";
import DatePickerContent from "#foundation/components/common/date-picker/content.vue";
import DatePickerCalendar from "#foundation/components/common/date-picker/calendar.vue";
import DatePickerHeader from "#foundation/components/common/date-picker/header.vue";
import DatePickerHeading from "#foundation/components/common/date-picker/heading.vue";
import DatePickerPrev from "#foundation/components/common/date-picker/prev.vue";
import DatePickerNext from "#foundation/components/common/date-picker/next.vue";
import DatePickerGrid from "#foundation/components/common/date-picker/grid.vue";
import DatePickerGridHead from "#foundation/components/common/date-picker/grid-head.vue";
import DatePickerGridBody from "#foundation/components/common/date-picker/grid-body.vue";
import DatePickerGridRow from "#foundation/components/common/date-picker/grid-row.vue";
import DatePickerHeadCell from "#foundation/components/common/date-picker/head-cell.vue";
import DatePickerCell from "#foundation/components/common/date-picker/cell.vue";
import DatePickerCellTrigger from "#foundation/components/common/date-picker/cell-trigger.vue";
import Icon from "#foundation/components/common/icon.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
import { DATE_PICKER_SIDE_OFFSET } from "#foundation/constants/date-picker";
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
    triggerIcon: { alias: "calendar" },
    content: { sideOffset: DATE_PICKER_SIDE_OFFSET },
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
  <DatePickerRoot ref="el" v-bind="settings.root">
    <DatePickerField v-bind="settings.field">
      <template #default="{ segments }">
        <slot name="field" v-bind="{ ...ctx, segments }">
          <template v-for="segment in segments" :key="segment.part">
            <slot name="input" v-bind="{ ...ctx, segment }">
              <DatePickerInput v-bind="settings.input(segment)">
                {{ segment.value }}
              </DatePickerInput>
            </slot>
          </template>
          <slot name="trigger" v-bind="ctx">
            <DatePickerTrigger v-bind="settings.trigger">
              <slot name="triggerIcon" v-bind="ctx">
                <Icon v-bind="settings.triggerIcon" />
              </slot>
            </DatePickerTrigger>
          </slot>
        </slot>
      </template>
    </DatePickerField>
    <slot name="content" v-bind="ctx">
      <DatePickerContent v-bind="settings.content">
        <DatePickerCalendar v-bind="settings.calendar">
          <template #default="{ weekDays, grid }">
            <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
              <DatePickerHeader v-bind="settings.header">
                <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
                  <DatePickerPrev v-bind="settings.prev">
                    <slot name="prevIcon" v-bind="{ ...ctx, weekDays, grid }">
                      <Icon v-bind="settings.prevIcon" />
                    </slot>
                  </DatePickerPrev>
                </slot>
                <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
                  <DatePickerHeading v-bind="settings.heading" />
                </slot>
                <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
                  <DatePickerNext v-bind="settings.next">
                    <slot name="nextIcon" v-bind="{ ...ctx, weekDays, grid }">
                      <Icon v-bind="settings.nextIcon" />
                    </slot>
                  </DatePickerNext>
                </slot>
              </DatePickerHeader>
            </slot>
            <template v-for="month in grid" :key="month.value.toString()">
              <slot name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
                <DatePickerGrid v-bind="settings.grid">
                  <slot name="gridHead" v-bind="{ ...ctx, weekDays, grid, month }">
                    <DatePickerGridHead v-bind="settings.gridHead">
                      <DatePickerGridRow v-bind="settings.gridRow">
                        <template v-for="day in weekDays" :key="day">
                          <slot name="headCell" v-bind="{ ...ctx, day }">
                            <DatePickerHeadCell v-bind="settings.headCell">
                              {{ day }}
                            </DatePickerHeadCell>
                          </slot>
                        </template>
                      </DatePickerGridRow>
                    </DatePickerGridHead>
                  </slot>
                  <slot name="gridBody" v-bind="{ ...ctx, weekDays, grid, month }">
                    <DatePickerGridBody v-bind="settings.gridBody">
                      <DatePickerGridRow
                        v-for="(week, i) in month.rows"
                        :key="i"
                        v-bind="settings.gridRow"
                      >
                        <template v-for="date in week" :key="date.toString()">
                          <slot name="cell" v-bind="{ ...ctx, month, date }">
                            <DatePickerCell v-bind="settings.cell(date)">
                              <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                                <DatePickerCellTrigger
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
