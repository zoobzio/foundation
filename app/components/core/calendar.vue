<script lang="ts">
import type {
  CalendarProps,
  CalendarEmits,
  CalendarPassthrough,
  CalendarContext,
  CalendarSlots,
} from "../../types/core/calendar";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance } from "vue";

import CalendarRoot from "../common/calendar/root.vue";
import CalendarHeader from "../common/calendar/header.vue";
import CalendarHeading from "../common/calendar/heading.vue";
import CalendarPrev from "../common/calendar/prev.vue";
import CalendarNext from "../common/calendar/next.vue";
import CalendarGrid from "../common/calendar/grid.vue";
import CalendarGridHead from "../common/calendar/grid-head.vue";
import CalendarGridBody from "../common/calendar/grid-body.vue";
import CalendarGridRow from "../common/calendar/grid-row.vue";
import CalendarHeadCell from "../common/calendar/head-cell.vue";
import CalendarCell from "../common/calendar/cell.vue";
import CalendarCellTrigger from "../common/calendar/cell-trigger.vue";
import Icon from "../common/icon.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { modelValue, maxValue, pt } = defineProps<CalendarProps>();

const emit = defineEmits<CalendarEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateValue | undefined>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const settings = usePassthrough<CalendarPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      maxValue,
      "onUpdate:modelValue": (v) => {
        $model.value = v;
      },
    },
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

const ctx = useContext<CalendarContext>("calendar", () => ({
  maxValue,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<CalendarSlots>();
</script>

<template>
  <CalendarRoot ref="el" v-bind="settings.root">
    <template #default="{ weekDays, grid }">
      <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
        <CalendarHeader v-bind="settings.header">
          <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
            <CalendarPrev v-bind="settings.prev">
              <slot name="prevIcon" v-bind="{ ...ctx, weekDays, grid }">
                <Icon v-bind="settings.prevIcon" />
              </slot>
            </CalendarPrev>
          </slot>
          <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
            <CalendarHeading v-bind="settings.heading" />
          </slot>
          <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
            <CalendarNext v-bind="settings.next">
              <slot name="nextIcon" v-bind="{ ...ctx, weekDays, grid }">
                <Icon v-bind="settings.nextIcon" />
              </slot>
            </CalendarNext>
          </slot>
        </CalendarHeader>
      </slot>
      <template v-for="month in grid" :key="month.value.toString()">
        <slot name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
          <CalendarGrid v-bind="settings.grid">
            <slot name="gridHead" v-bind="{ ...ctx, weekDays, grid, month }">
              <CalendarGridHead v-bind="settings.gridHead">
                <CalendarGridRow v-bind="settings.gridRow">
                  <template v-for="day in weekDays" :key="day">
                    <slot name="headCell" v-bind="{ ...ctx, day }">
                      <CalendarHeadCell v-bind="settings.headCell">
                        {{ day }}
                      </CalendarHeadCell>
                    </slot>
                  </template>
                </CalendarGridRow>
              </CalendarGridHead>
            </slot>
            <slot name="gridBody" v-bind="{ ...ctx, weekDays, grid, month }">
              <CalendarGridBody v-bind="settings.gridBody">
                <CalendarGridRow
                  v-for="(week, i) in month.rows"
                  :key="i"
                  v-bind="settings.gridRow"
                >
                  <template v-for="date in week" :key="date.toString()">
                    <slot name="cell" v-bind="{ ...ctx, month, date }">
                      <CalendarCell v-bind="settings.cell(date)">
                        <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                          <CalendarCellTrigger
                            v-bind="settings.cellTrigger({ day: date, month: month.value })"
                          />
                        </slot>
                      </CalendarCell>
                    </slot>
                  </template>
                </CalendarGridRow>
              </CalendarGridBody>
            </slot>
          </CalendarGrid>
        </slot>
      </template>
    </template>
  </CalendarRoot>
</template>
