<script lang="ts">
import type {
  DateFiltersProps,
  DateFiltersPassthrough,
  DateFiltersContext,
  DateFiltersSlots,
  DateFilter,
  DateFilterOperator,
} from "#foundation/types/core/date-filters";
import type { CommandOption } from "#foundation/types/core/command";
import type { DateValue } from "@internationalized/date";
import type { DateRange } from "reka-ui";
import type { ComponentPublicInstance } from "vue";

import Button from "#foundation/components/common/button.vue";
import Calendar from "#foundation/components/core/calendar.vue";
import Command from "#foundation/components/core/command.vue";
import Fab from "#foundation/components/core/fab.vue";
import Group from "#foundation/components/common/group.vue";
import Icon from "#foundation/components/common/icon.vue";
import Popover from "#foundation/components/core/popover.vue";
import RangeCalendar from "#foundation/components/core/range-calendar.vue";

import { computed, nextTick, ref, useTemplateRef, watch } from "#imports";
import { today, getLocalTimeZone } from "@internationalized/date";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import { serialize, deserialize, format } from "#foundation/utils/date";
</script>

<script setup lang="ts">
const { modelValue: filters, fields, addFilter, pt } = defineProps<DateFiltersProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const open = ref(false);
const step = ref<1 | 2 | 3>(1);
const selectedField = ref("");
const selectedOperator = ref<DateFilterOperator | "">("");
const selectedDate = ref<DateValue>();
const selectedRange = ref<DateRange>();

const activeCount = computed(() => filters?.length ?? 0);

const fieldGroups = computed<{ key: string; label: string; options: CommandOption[] }[]>(() => [
  {
    key: "fields",
    label: "Fields",
    options: fields.map((f) => ({ value: f.key, label: f.label })),
  },
]);

const operatorGroups: { key: string; label: string; options: CommandOption[] }[] = [
  {
    key: "operators",
    label: "Operators",
    options: [
      { value: "after", label: "After" },
      { value: "before", label: "Before" },
      { value: "between", label: "Between" },
    ],
  },
];

const onFieldSelect = (value: string) => {
  selectedField.value = value;
  selectedOperator.value = "";
  selectedDate.value = undefined;
  selectedRange.value = undefined;
  step.value = 2;
};

const onOperatorSelect = (value: string) => {
  selectedOperator.value = value as DateFilterOperator;
  selectedDate.value = undefined;
  selectedRange.value = undefined;
  step.value = 3;
};

const isFormValid = computed(() => {
  if (selectedOperator.value === "between") {
    return !!(selectedRange.value?.start && selectedRange.value?.end);
  }
  return !!selectedDate.value;
});

const resetStepper = () => {
  open.value = false;
  step.value = 1;
  selectedField.value = "";
  selectedOperator.value = "";
  selectedDate.value = undefined;
  selectedRange.value = undefined;
};

const applyFilter = () => {
  if (!selectedField.value || !selectedOperator.value) return;

  let filter: DateFilter;
  if (selectedOperator.value === "between") {
    if (!selectedRange.value?.start || !selectedRange.value?.end) return;
    filter = {
      field: selectedField.value,
      operator: selectedOperator.value,
      value: serialize(selectedRange.value.start),
      endValue: serialize(selectedRange.value.end),
    };
  } else {
    if (!selectedDate.value) return;
    filter = {
      field: selectedField.value,
      operator: selectedOperator.value,
      value: serialize(selectedDate.value),
    };
  }

  addFilter(filter);
  resetStepper();
};

const goToStep = (target: 1 | 2 | 3) => {
  if (target === step.value) return;
  if (target === 1) {
    selectedField.value = "";
    selectedOperator.value = "";
    selectedDate.value = undefined;
    selectedRange.value = undefined;
    step.value = 1;
  } else if (target === 2 && selectedField.value) {
    selectedOperator.value = "";
    selectedDate.value = undefined;
    selectedRange.value = undefined;
    step.value = 2;
  }
};

const fieldLabel = computed(() =>
  fields.find((f) => f.key === selectedField.value)?.label ?? "Field",
);

const operatorLabel = computed(() => {
  if (!selectedOperator.value) return "Operator";
  return selectedOperator.value.charAt(0).toUpperCase() + selectedOperator.value.slice(1);
});

const valueLabel = computed(() => {
  if (selectedOperator.value === "between") {
    if (!selectedRange.value?.start || !selectedRange.value?.end) return "Value";
    return `${format(selectedRange.value.start)},${format(selectedRange.value.end)}`;
  }
  if (!selectedDate.value) return "Value";
  return format(selectedDate.value);
});

watch(open, (isOpen) => {
  if (isOpen && filters?.length) {
    const last = filters[filters.length - 1]!;
    selectedField.value = last.field;
    selectedOperator.value = last.operator;
    step.value = 3;
    nextTick(() => {
      if (last.operator === "between" && last.endValue) {
        selectedRange.value = {
          start: deserialize(last.value),
          end: deserialize(last.endValue),
        };
        selectedDate.value = undefined;
      } else {
        selectedDate.value = deserialize(last.value);
        selectedRange.value = undefined;
      }
    });
  } else if (!isOpen) {
    step.value = 1;
    selectedField.value = "";
    selectedOperator.value = "";
    selectedDate.value = undefined;
    selectedRange.value = undefined;
  }
});

const settings = usePassthrough<DateFiltersPassthrough>(() => ({
  pt,
  recipes: {
    popover: {
      open: open.value,
      align: "end",
      "onUpdate:open": (v) => {
        open.value = v;
      },
    },
    trigger: {
      icon: "calendar",
      badge: activeCount.value > 0 ? "" : undefined,
    },
    root: {},
    stepper: {},
    stepSeparator: { alias: "chevron-right" },
    fieldCommand: {
      groups: fieldGroups.value,
      placeholder: "Search fields...",
      "onUpdate:modelValue": (v) => {
        const option = v?.[0];
        if (option) onFieldSelect(option.value);
      },
    },
    operatorCommand: {
      groups: operatorGroups,
      placeholder: "Search operators...",
      "onUpdate:modelValue": (v) => {
        const option = v?.[0];
        if (option) onOperatorSelect(option.value);
      },
    },
    calendarWrapper: {},
    calendar: {
      modelValue: selectedDate.value,
      maxValue: today(getLocalTimeZone()),
      "onUpdate:modelValue": (v) => {
        selectedDate.value = v;
      },
    },
    rangeCalendar: {
      modelValue: selectedRange.value,
      maxValue: today(getLocalTimeZone()),
      "onUpdate:modelValue": (v) => {
        selectedRange.value = v;
      },
    },
    actions: {},
    applyButton: {
      type: "button",
      disabled: !isFormValid.value,
      onClick: () => applyFilter(),
    },
  },
}));

const ctx = useContext<DateFiltersContext>("date-filters", () => ({
  fields,
  filters,
  activeCount: activeCount.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<DateFiltersSlots>();
</script>

<template>
  <slot name="popover" v-bind="ctx">
    <Popover v-bind="settings.popover">
      <template #trigger>
        <slot name="trigger" v-bind="ctx">
          <Fab v-bind="settings.trigger" />
        </slot>
      </template>
      <template #content>
        <slot name="root" v-bind="ctx">
          <Group ref="el" v-bind="settings.root" class="f-date-filters">
            <slot name="stepper" v-bind="ctx">
              <Group v-bind="settings.stepper" class="f-date-filters-stepper">
                <button
                  type="button"
                  :tabindex="step === 1 ? -1 : 0"
                  :class="[
                    'f-date-filters-step',
                    { 'f-date-filters-step--active': step === 1 },
                    { 'f-date-filters-step--completed': selectedField },
                    { 'f-date-filters-step--disabled': !selectedField && step !== 1 },
                  ]"
                  @click="goToStep(1)"
                >
                  {{ fieldLabel }}
                </button>
                <Icon v-bind="settings.stepSeparator" class="f-date-filters-step-separator" />
                <button
                  type="button"
                  :tabindex="step === 2 ? -1 : 0"
                  :class="[
                    'f-date-filters-step',
                    { 'f-date-filters-step--active': step === 2 },
                    { 'f-date-filters-step--completed': selectedOperator },
                    { 'f-date-filters-step--disabled': !selectedOperator && step !== 2 },
                  ]"
                  :disabled="!selectedField"
                  @click="goToStep(2)"
                >
                  {{ operatorLabel }}
                </button>
                <Icon v-bind="settings.stepSeparator" class="f-date-filters-step-separator" />
                <button
                  type="button"
                  :class="[
                    'f-date-filters-step',
                    { 'f-date-filters-step--active': step === 3 },
                    { 'f-date-filters-step--disabled': step !== 3 },
                  ]"
                  disabled
                >
                  {{ valueLabel }}
                </button>
              </Group>
            </slot>

            <slot name="fieldCommand" v-bind="ctx">
              <Command v-if="step === 1" v-bind="settings.fieldCommand" />
            </slot>

            <slot name="operatorCommand" v-bind="ctx">
              <Command v-if="step === 2" v-bind="settings.operatorCommand" />
            </slot>

            <slot name="calendarWrapper" v-bind="ctx">
              <Group v-if="step === 3" v-bind="settings.calendarWrapper" class="f-date-filters-calendar">
                <slot name="calendar" v-bind="ctx">
                  <RangeCalendar v-if="selectedOperator === 'between'" v-bind="settings.rangeCalendar" />
                  <Calendar v-else v-bind="settings.calendar" />
                </slot>
                <slot name="actions" v-bind="ctx">
                  <Group v-bind="settings.actions" class="f-date-filters-actions">
                    <slot name="applyButton" v-bind="ctx">
                      <Button v-bind="settings.applyButton">Apply</Button>
                    </slot>
                  </Group>
                </slot>
              </Group>
            </slot>
          </Group>
        </slot>
      </template>
    </Popover>
  </slot>
</template>
