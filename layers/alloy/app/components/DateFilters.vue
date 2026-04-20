<script lang="ts">
import type { DateValue } from "@internationalized/date";
import type { DateFiltersProps, DateFilter, DateFilterOperator } from "../types/date-filters";
</script>

<script setup lang="ts">
const { fields, addFilter, removeFilter, pt } = defineProps<DateFiltersProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const filters = defineModel<DateFilter[]>({ default: () => [] });
const open = ref(false);
const view = ref<"list" | "add">("list");

const selectedField = ref("");
const selectedOperator = ref<DateFilterOperator>("after");
const selectedDate = ref<DateValue>();
const selectedRange = ref<DateRange>();

const fieldOptions = computed<Option[]>(() =>
  fields.map((f) => ({ value: f.key, label: f.label })),
);

const operatorOptions: Option[] = [
  { value: "after", label: "After" },
  { value: "before", label: "Before" },
  { value: "between", label: "Between" },
];

const activeCount = computed(() => filters.value.length);

const isFormValid = computed(() => {
  if (!selectedField.value || !selectedOperator.value) return false;
  if (selectedOperator.value === "between") {
    return !!(selectedRange.value?.start && selectedRange.value?.end);
  }
  return !!selectedDate.value;
});

const dateValueToDate = (dv: DateValue): Date => dv.toDate("UTC");

const resetForm = () => {
  selectedField.value = "";
  selectedOperator.value = "after";
  selectedDate.value = undefined;
  selectedRange.value = undefined;
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

  addFilter(filter);
  resetForm();
  view.value = "list";
};

const formatDateFilter = (filter: DateFilter) => {
  const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
  const date = formatter.format(filter.value);
  switch (filter.operator) {
    case "before": return `Before ${date}`;
    case "after": return `After ${date}`;
    case "between": {
      const end = filter.endValue ? formatter.format(filter.endValue) : "?";
      return `${date} – ${end}`;
    }
  }
};

const getFieldLabel = (field: string) =>
  fields.find((f) => f.key === field)?.label ?? field;

watch(open, (isOpen) => {
  if (!isOpen) {
    view.value = "list";
    resetForm();
  }
});

const ctx = computed(() => ({ fields, filters: filters.value, view: view.value, activeCount: activeCount.value }));
</script>

<template>
  <Popover v-model:open="open" align="start">
    <slot name="trigger" v-bind="ctx">
      <Fab icon="calendar" :badge="activeCount > 0 ? activeCount : undefined" />
    </slot>
    <template #content>
      <slot v-bind="ctx">
        <Group ref="el" v-bind="pt?.root" class="f-date-filters">
          <template v-if="view === 'list'">
            <Scroller class="f-date-filters-content">
              <Group v-if="activeCount === 0" class="f-date-filters-empty">
                No date filters applied
              </Group>
              <Ul v-else class="f-date-filters-list">
                <Li
                  v-for="filter in filters"
                  :key="filter.field"
                  class="f-date-filters-list-item"
                >
                  <Group class="f-date-filters-list-item-content">
                    <Span class="f-date-filters-list-item-field">{{ getFieldLabel(filter.field) }}</Span>
                    <Span class="f-date-filters-list-item-value">{{ formatDateFilter(filter) }}</Span>
                  </Group>
                  <Fab icon="close" @click="removeFilter(filter.field)" />
                </Li>
              </Ul>
            </Scroller>
            <Group class="f-date-filters-actions">
              <Fab icon="add" @click="startAdd" />
            </Group>
          </template>

          <template v-else>
            <Scroller class="f-date-filters-content">
              <Group class="f-date-filters-fieldset">
                <Caption>Field</Caption>
                <SegmentedControl
                  v-model="selectedField"
                  :options="fieldOptions"
                  required
                />
              </Group>
              <Group class="f-date-filters-fieldset">
                <Caption>Operator</Caption>
                <SegmentedControl
                  v-model="selectedOperator"
                  :options="operatorOptions"
                  required
                />
              </Group>
              <Group class="f-date-filters-calendar">
                <RangeCalendar v-if="selectedOperator === 'between'" v-model="selectedRange" />
                <Calendar v-else v-model="selectedDate" />
              </Group>
            </Scroller>
            <Group class="f-date-filters-actions">
              <Fab icon="close" @click="cancelAdd" />
              <Fab icon="check" :disabled="!isFormValid" @click="applyFilter" />
            </Group>
          </template>
        </Group>
      </slot>
    </template>
  </Popover>
</template>
