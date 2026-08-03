<script lang="ts">
import type {
  RangeCalendarProps,
  RangeCalendarEmits,
  RangeCalendarPassthrough,
  RangeCalendarContext,
  RangeCalendarSlots,
} from "#foundation/types/core/range-calendar";
import type { DateRange } from "reka-ui";
import type { ComponentPublicInstance } from "vue";

import RangeCalendarRoot from "#foundation/components/common/range-calendar/root.vue";
import RangeCalendarHeader from "#foundation/components/common/range-calendar/header.vue";
import RangeCalendarHeading from "#foundation/components/common/range-calendar/heading.vue";
import RangeCalendarPrev from "#foundation/components/common/range-calendar/prev.vue";
import RangeCalendarNext from "#foundation/components/common/range-calendar/next.vue";
import RangeCalendarGrid from "#foundation/components/common/range-calendar/grid.vue";
import RangeCalendarGridHead from "#foundation/components/common/range-calendar/grid-head.vue";
import RangeCalendarGridBody from "#foundation/components/common/range-calendar/grid-body.vue";
import RangeCalendarGridRow from "#foundation/components/common/range-calendar/grid-row.vue";
import RangeCalendarHeadCell from "#foundation/components/common/range-calendar/head-cell.vue";
import RangeCalendarCell from "#foundation/components/common/range-calendar/cell.vue";
import RangeCalendarCellTrigger from "#foundation/components/common/range-calendar/cell-trigger.vue";
import Icon from "#foundation/components/common/icon.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modelValue, maxValue, pt } = defineProps<RangeCalendarProps>();

const emit = defineEmits<RangeCalendarEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateRange | undefined>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const settings = usePassthrough<RangeCalendarPassthrough>(() => ({
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

const ctx = useContext<RangeCalendarContext>("calendar", () => ({
  maxValue,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarSlots>();
</script>

<template>
  <RangeCalendarRoot ref="el" v-bind="settings.root">
    <template #default="{ weekDays, grid }">
      <slot name="header" v-bind="{ ...ctx, weekDays, grid }">
        <RangeCalendarHeader v-bind="settings.header">
          <slot name="prev" v-bind="{ ...ctx, weekDays, grid }">
            <RangeCalendarPrev v-bind="settings.prev">
              <slot name="prevIcon" v-bind="{ ...ctx, weekDays, grid }">
                <Icon v-bind="settings.prevIcon" />
              </slot>
            </RangeCalendarPrev>
          </slot>
          <slot name="heading" v-bind="{ ...ctx, weekDays, grid }">
            <RangeCalendarHeading v-bind="settings.heading" />
          </slot>
          <slot name="next" v-bind="{ ...ctx, weekDays, grid }">
            <RangeCalendarNext v-bind="settings.next">
              <slot name="nextIcon" v-bind="{ ...ctx, weekDays, grid }">
                <Icon v-bind="settings.nextIcon" />
              </slot>
            </RangeCalendarNext>
          </slot>
        </RangeCalendarHeader>
      </slot>
      <template v-for="month in grid" :key="month.value.toString()">
        <slot name="grid" v-bind="{ ...ctx, weekDays, grid, month }">
          <RangeCalendarGrid v-bind="settings.grid">
            <slot name="gridHead" v-bind="{ ...ctx, weekDays, grid, month }">
              <RangeCalendarGridHead v-bind="settings.gridHead">
                <RangeCalendarGridRow v-bind="settings.gridRow">
                  <template v-for="day in weekDays" :key="day">
                    <slot name="headCell" v-bind="{ ...ctx, day }">
                      <RangeCalendarHeadCell v-bind="settings.headCell">
                        {{ day }}
                      </RangeCalendarHeadCell>
                    </slot>
                  </template>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
            </slot>
            <slot name="gridBody" v-bind="{ ...ctx, weekDays, grid, month }">
              <RangeCalendarGridBody v-bind="settings.gridBody">
                <RangeCalendarGridRow
                  v-for="(week, i) in month.rows"
                  :key="i"
                  v-bind="settings.gridRow"
                >
                  <template v-for="date in week" :key="date.toString()">
                    <slot name="cell" v-bind="{ ...ctx, month, date }">
                      <RangeCalendarCell v-bind="settings.cell(date)">
                        <slot name="cellTrigger" v-bind="{ ...ctx, month, date }">
                          <RangeCalendarCellTrigger
                            v-bind="settings.cellTrigger({ day: date, month: month.value })"
                          />
                        </slot>
                      </RangeCalendarCell>
                    </slot>
                  </template>
                </RangeCalendarGridRow>
              </RangeCalendarGridBody>
            </slot>
          </RangeCalendarGrid>
        </slot>
      </template>
    </template>
  </RangeCalendarRoot>
</template>
