<script setup lang="ts">
import type { DateFilterableStore, DateFilter, DateFilterOperator, Option } from "@foundation/blocks/types/common";
import type { DateValue } from "@internationalized/date";
import type { DateRange } from "@foundation/blocks/types/date-range-picker";

const props = defineProps<{
  store: DateFilterableStore;
}>();

const open = defineModel<boolean>("open", { default: false });

// View state: 'list' or 'add'
const view = ref<"list" | "add">("list");

// Form state
const selectedField = ref<string>("");
const selectedOperator = ref<DateFilterOperator>("after");
const selectedDate = ref<DateValue>();
const selectedRange = ref<DateRange>();

// Field options from store
const fieldOptions = computed<Option[]>(() =>
  props.store.dateFields.map((f) => ({ value: f.key, label: f.label }))
);

// Operator options
const operatorOptions: Option[] = [
  { value: "after", label: "After" },
  { value: "before", label: "Before" },
  { value: "between", label: "Between" },
];

// Active filter count for badge
const activeCount = computed(() => props.store.dateFilters?.value?.length ?? 0);

// Form validation
const isFormValid = computed(() => {
  if (!selectedField.value) return false;
  if (!selectedOperator.value) return false;

  if (selectedOperator.value === "between") {
    return !!(selectedRange.value?.start && selectedRange.value?.end);
  }
  return !!selectedDate.value;
});

// Convert DateValue to JS Date
const dateValueToDate = (dv: DateValue): Date => {
  return dv.toDate("UTC");
};

// Start adding a filter
const startAdd = () => {
  // Set defaults so required fields are pre-selected
  selectedField.value = fieldOptions.value[0]?.value ?? "";
  selectedOperator.value = "after";
  selectedDate.value = undefined;
  selectedRange.value = undefined;
  view.value = "add";
};

// Cancel adding
const cancelAdd = () => {
  resetForm();
  view.value = "list";
};

// Apply filter
const applyFilter = () => {
  if (!selectedField.value) return;

  if (selectedOperator.value === "between") {
    if (!selectedRange.value?.start || !selectedRange.value?.end) return;
    const filter: DateFilter = {
      field: selectedField.value,
      operator: selectedOperator.value,
      value: dateValueToDate(selectedRange.value.start),
      endValue: dateValueToDate(selectedRange.value.end),
    };
    props.store.addDateFilter(filter);
  } else {
    if (!selectedDate.value) return;
    const filter: DateFilter = {
      field: selectedField.value,
      operator: selectedOperator.value,
      value: dateValueToDate(selectedDate.value),
    };
    props.store.addDateFilter(filter);
  }

  resetForm();
  view.value = "list";
};

const resetForm = () => {
  selectedField.value = "";
  selectedOperator.value = "after";
  selectedDate.value = undefined;
  selectedRange.value = undefined;
};

// Format filter for display
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

// Get field label
const getFieldLabel = (field: string) => {
  return props.store.dateFields.find((f) => f.key === field)?.label ?? field;
};

// Reset view when popover closes
watch(open, (isOpen) => {
  if (!isOpen) {
    view.value = "list";
    resetForm();
  }
});
</script>

<template>
  <Popover v-model:open="open" align="end">
    <Fab icon="calendar" label="Date filters" :badge="activeCount > 0 ? activeCount : undefined" />
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
                v-for="filter in store.dateFilters.value"
                :key="filter.field"
                class="f-date-filters-list-item"
              >
                <div class="f-date-filters-list-item-content">
                  <span class="f-date-filters-list-item-field">{{ getFieldLabel(filter.field) }}</span>
                  <span class="f-date-filters-list-item-value">{{ formatDateFilter(filter) }}</span>
                </div>
                <Fab icon="close" label="Remove filter" @click="store.removeDateFilter(filter.field)" />
              </li>
            </ul>
          </Scroller>
          <div class="f-date-filters-actions">
            <Fab icon="add" label="Add filter" @click="startAdd" />
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
            <Fab icon="close" label="Cancel" @click="cancelAdd" />
            <Fab icon="check" label="Apply" :disabled="!isFormValid" @click="applyFilter" />
          </div>
        </template>
      </div>
    </template>
  </Popover>
</template>
