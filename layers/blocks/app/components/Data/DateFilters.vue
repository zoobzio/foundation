<script setup lang="ts">
import type { DateFilter, DateFilterOperator, DateFieldConfig, Option } from "../../types/common";
import type { DateValue } from "@internationalized/date";
import type { DateRange } from "../../types/date-range-picker";

const props = defineProps<{
  fields: DateFieldConfig[];
}>();

const filters = defineModel<DateFilter[]>("filters", { default: () => [] });
const open = defineModel<boolean>("open", { default: false });

// View state: 'list' or 'add'
const view = ref<"list" | "add">("list");

// Form state
const selectedField = ref<string>("");
const selectedOperator = ref<DateFilterOperator>("after");
const selectedDate = ref<DateValue>();
const selectedRange = ref<DateRange>();

// Field options
const fieldOptions = computed<Option[]>(() =>
  props.fields.map((f) => ({ value: f.key, label: f.label }))
);

// Operator options
const operatorOptions: Option[] = [
  { value: "after", label: "After" },
  { value: "before", label: "Before" },
  { value: "between", label: "Between" },
];

const activeCount = computed(() => filters.value.length);

const isFormValid = computed(() => {
  if (!selectedField.value) return false;
  if (!selectedOperator.value) return false;
  if (selectedOperator.value === "between") {
    return !!(selectedRange.value?.start && selectedRange.value?.end);
  }
  return !!selectedDate.value;
});

const dateValueToDate = (dv: DateValue): Date => {
  return dv.toDate("UTC");
};

const startAdd = () => {
  selectedField.value = fieldOptions.value[0]?.value ?? "";
  selectedOperator.value = "after";
  selectedDate.value = undefined;
  selectedRange.value = undefined;
  view.value = "add";
};

const cancelAdd = () => {
  resetForm();
  view.value = "list";
};

const applyFilter = () => {
  if (!selectedField.value) return;

  let filter: DateFilter;
  if (selectedOperator.value === "between") {
    if (!selectedRange.value?.start || !selectedRange.value?.end) return;
    filter = {
      field: selectedField.value,
      operator: selectedOperator.value,
      value: dateValueToDate(selectedRange.value.start),
      endValue: dateValueToDate(selectedRange.value.end),
    };
  } else {
    if (!selectedDate.value) return;
    filter = {
      field: selectedField.value,
      operator: selectedOperator.value,
      value: dateValueToDate(selectedDate.value),
    };
  }

  // Replace existing filter for this field, or add new
  const existing = filters.value.findIndex((f) => f.field === filter.field);
  if (existing >= 0) {
    const next = [...filters.value];
    next[existing] = filter;
    filters.value = next;
  } else {
    filters.value = [...filters.value, filter];
  }

  resetForm();
  view.value = "list";
};

const removeFilter = (field: string) => {
  filters.value = filters.value.filter((f) => f.field !== field);
};

const resetForm = () => {
  selectedField.value = "";
  selectedOperator.value = "after";
  selectedDate.value = undefined;
  selectedRange.value = undefined;
};

const formatDateFilter = (filter: DateFilter) => {
  const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
  const date = formatter.format(filter.value);
  switch (filter.operator) {
    case "before":
      return `Before ${date}`;
    case "after":
      return `After ${date}`;
    case "between":
      const end = filter.endValue ? formatter.format(filter.endValue) : "?";
      return `${date} – ${end}`;
  }
};

const getFieldLabel = (field: string) => {
  return props.fields.find((f) => f.key === field)?.label ?? field;
};

watch(open, (isOpen) => {
  if (!isOpen) {
    view.value = "list";
    resetForm();
  }
});
</script>

<template>
  <Popover v-model:open="open" align="start">
    <Fab icon="calendar" :badge="activeCount > 0 ? activeCount : undefined" />
    <template #content>
      <div class="f-date-filters">
        <!-- List view -->
        <template v-if="view === 'list'">
          <Scroller class="f-date-filters-content">
            <div v-if="activeCount === 0" class="f-date-filters-empty">
              No date filters applied
            </div>
            <ul v-else class="f-date-filters-list">
              <li
                v-for="filter in filters"
                :key="filter.field"
                class="f-date-filters-list-item"
              >
                <div class="f-date-filters-list-item-content">
                  <span class="f-date-filters-list-item-field">{{ getFieldLabel(filter.field) }}</span>
                  <span class="f-date-filters-list-item-value">{{ formatDateFilter(filter) }}</span>
                </div>
                <Fab icon="close" @click="removeFilter(filter.field)" />
              </li>
            </ul>
          </Scroller>
          <div class="f-date-filters-actions">
            <Fab icon="add" @click="startAdd" />
          </div>
        </template>

        <!-- Add view -->
        <template v-else>
          <Scroller class="f-date-filters-content">
            <fieldset class="f-date-filters-fieldset">
              <Caption>Field</Caption>
              <SegmentedControl
                v-model="selectedField"
                :options="fieldOptions"
                required
              />
            </fieldset>

            <fieldset class="f-date-filters-fieldset">
              <Caption>Operator</Caption>
              <SegmentedControl
                v-model="selectedOperator"
                :options="operatorOptions"
                required
              />
            </fieldset>

            <div class="f-date-filters-calendar">
              <RangeCalendar
                v-if="selectedOperator === 'between'"
                v-model="selectedRange"
              />
              <Calendar v-else v-model="selectedDate" />
            </div>
          </Scroller>
          <div class="f-date-filters-actions">
            <Fab icon="close" @click="cancelAdd" />
            <Fab icon="check" :disabled="!isFormValid" @click="applyFilter" />
          </div>
        </template>
      </div>
    </template>
  </Popover>
</template>
