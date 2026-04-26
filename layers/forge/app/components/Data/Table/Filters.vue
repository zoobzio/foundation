<script lang="ts">
import type { DataTableColumn } from "../../../types/data-table";
import type { DataTableFiltersProps } from "../../../types/data-table-filters";
import { parseShorthand } from "../../../utils/parse-shorthand";
import { validateKeywords } from "../../../utils/validate-keywords";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { table, pt } = defineProps<DataTableFiltersProps<T, K>>();

const {
  columns,
  filters,
  addFilter,
  removeFilter,
  query,
  keywords,
  page,
  fetch: fetchData,
} = table;

const el = useTemplateRef("el");
const autocompleteRef = useTemplateRef<{ focus: () => void }>("autocomplete");
defineExpose({ el });

const inputValue = ref("");

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const chipsPT = usePassthrough(pt?.chips, { props: {}, handlers: {} });
const iconPT = usePassthrough(pt?.icon, {
  props: { alias: "sparkle" as IconAlias },
  handlers: {},
});
const inputWrapPT = usePassthrough(pt?.inputWrap, { props: {}, handlers: {} });

// Locked steps — each entry is a locked selection
const lockedSteps = ref<AutocompleteItem[]>([]);
const lockedField = shallowRef<DataTableColumn<T> | null>(null);
const lockedOperator = ref<string | null>(null);
const lockedDate1 = ref<string | null>(null);

// Column groups
const enumColumns = computed(() =>
  (columns as DataTableColumn<T>[]).filter(
    (c) => c.type === "enum" && c.enumValues?.length,
  ),
);

const dateColumns = computed(() =>
  (columns as DataTableColumn<T>[]).filter(
    (c) => c.type === "date" || c.type === "datetime",
  ),
);

// Generate recent dates
const recentDates = computed(() => {
  const dates: { label: string; value: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const value = `${y}-${m}-${day}`;
    const label = i === 0 ? `${value} (today)` : value;
    dates.push({ label, value });
  }
  return dates;
});

// Locked prefix for input tracking
const lockedPrefix = computed(() => {
  if (!lockedField.value) return "";
  const fieldLabel = lockedField.value.label;
  if (lockedField.value.type === "enum") return `${fieldLabel}=`;
  if (lockedOperator.value === "><" && lockedDate1.value)
    return `${fieldLabel}><${lockedDate1.value},`;
  if (lockedOperator.value) return `${fieldLabel}${lockedOperator.value}`;
  return fieldLabel;
});

const activeText = computed(() => {
  if (lockedPrefix.value && inputValue.value.startsWith(lockedPrefix.value)) {
    return inputValue.value.slice(lockedPrefix.value.length);
  }
  return inputValue.value;
});

const isRawMode = computed(
  () => inputValue.value.startsWith('"') || inputValue.value.startsWith("("),
);

const closingHint = computed(() => {
  const v = inputValue.value;
  if (v.startsWith('"') && (v.length === 1 || !v.endsWith('"'))) return '"';
  if (v.startsWith("(") && !v.endsWith(")")) return ")";
  return "";
});

// Phase detection
const phase = computed(() => {
  if (!lockedField.value) return "field";
  if (lockedField.value.type === "enum") return "enum-value";
  if (!lockedOperator.value) return "date-operator";
  if (lockedOperator.value === "><" && !lockedDate1.value) return "date-value";
  if (lockedOperator.value === "><" && lockedDate1.value) return "date-value-2";
  return "date-value";
});

// Already selected enum values
const selectedValues = computed(() => {
  if (!lockedField.value) return new Set<string>();
  const fieldKey = String(lockedField.value.key);
  const set = new Set<string>();
  for (const f of filters.value) {
    if (f.field === fieldKey && f.value.type === "enum") {
      for (const v of f.value.value) set.add(v);
    }
  }
  return set;
});

// Build suggestions for the active panel
const suggestions = computed<AutocompleteItem[]>(() => {
  if (isRawMode.value) return [];
  const search = activeText.value.toLowerCase();

  if (phase.value === "field") {
    const items: AutocompleteItem[] = [];
    if (!search || "search".includes(search)) {
      items.push({
        label: "Search",
        value: "__search",
        icon: "search",
      });
    }
    if (!search || "keywords".includes(search)) {
      items.push({
        label: "Keywords",
        value: "__keywords",
        icon: "tag",
      });
    }
    for (const c of enumColumns.value) {
      if (!search || c.label.toLowerCase().includes(search)) {
        items.push({
          label: c.label,
          value: String(c.key),
          hasChildren: true,
          icon: "filter",
        });
      }
    }
    for (const c of dateColumns.value) {
      if (!search || c.label.toLowerCase().includes(search)) {
        items.push({
          label: c.label,
          value: String(c.key),
          hasChildren: true,
          icon: "calendar",
        });
      }
    }
    return items;
  }

  if (phase.value === "enum-value" && lockedField.value?.enumValues) {
    return lockedField.value.enumValues
      .filter((v) => !search || v.toLowerCase().includes(search))
      .map((v) => ({
        label: v,
        value: v,
        disabled: selectedValues.value.has(v),
      }));
  }

  if (phase.value === "date-operator") {
    return [
      { label: "After", value: ">", hasChildren: true },
      { label: "Before", value: "<", hasChildren: true },
      { label: "Between", value: "><", hasChildren: true },
    ].filter((o) => !search || o.label.toLowerCase().includes(search));
  }

  if (phase.value === "date-value" || phase.value === "date-value-2") {
    const isBetweenFirst =
      phase.value === "date-value" && lockedOperator.value === "><";
    const isSecondDate = phase.value === "date-value-2";
    return recentDates.value
      .filter((d) => !search || d.value.includes(search))
      .map((d) => ({
        label: d.label,
        value: d.value,
        hasChildren: isBetweenFirst,
        disabled: isSecondDate && d.value === lockedDate1.value,
      }));
  }

  return [];
});

// Whether to show empty state
const showEmptyState = computed(
  () =>
    lockedSteps.value.length > 0 &&
    suggestions.value.length === 0 &&
    activeText.value.length > 0,
);

// Actions
const selectField = (col: DataTableColumn<T>) => {
  lockedField.value = col;
  lockedOperator.value = null;
  const icon =
    col.type === "enum" ? ("filter" as IconAlias) : ("calendar" as IconAlias);
  lockedSteps.value = [{ label: col.label, value: String(col.key), icon }];
  if (col.type === "enum") {
    inputValue.value = `${col.label}=`;
  } else {
    inputValue.value = `${col.label}`;
  }
  nextTick(() => autocompleteRef.value?.focus());
};

const operatorLabels: Record<string, string> = {
  ">": "After",
  "<": "Before",
  "><": "Between",
};

const selectDateOperator = (op: string) => {
  if (!lockedField.value) return;
  lockedOperator.value = op;
  lockedSteps.value = [
    ...lockedSteps.value,
    { label: operatorLabels[op] ?? op, value: op, hasChildren: true },
  ];
  inputValue.value = `${lockedField.value.label}${op}`;
  nextTick(() => autocompleteRef.value?.focus());
};

const selectValue = (value: string) => {
  if (!lockedField.value) return;

  if (lockedField.value.type === "enum") {
    addFilter({
      field: String(lockedField.value.key),
      operator: "is",
      value: { type: "enum", value: [value] },
    });
    resetAutocomplete();
    return;
  }

  if (lockedOperator.value === "><") {
    if (!lockedDate1.value) {
      lockedDate1.value = value;
      lockedSteps.value = [
        ...lockedSteps.value,
        { label: value, value, hasChildren: true },
      ];
      inputValue.value = `${lockedField.value.label}><${value},`;
      nextTick(() => autocompleteRef.value?.focus());
      return;
    }
    const dates = [lockedDate1.value, value].sort();
    table.addDateFilter({
      field: String(lockedField.value.key),
      operator: "between",
      value: new Date(dates[0]! + "T00:00:00Z"),
      endValue: new Date(dates[1]! + "T00:00:00Z"),
    });
    resetAutocomplete();
    return;
  }

  if (lockedOperator.value) {
    const date = new Date(value + "T00:00:00Z");
    table.addDateFilter({
      field: String(lockedField.value.key),
      operator: lockedOperator.value === ">" ? "after" : "before",
      value: date,
    });
    resetAutocomplete();
  }
};

const onSelect = (item: AutocompleteItem) => {
  if (item.disabled) return;

  if (item.value === "__search") {
    inputValue.value = '"';
    return;
  }
  if (item.value === "__keywords") {
    inputValue.value = "(";
    return;
  }

  if (lockedField.value) {
    if (phase.value === "date-operator") {
      selectDateOperator(item.value);
    } else {
      selectValue(item.value);
    }
    return;
  }

  const allCols = columns as DataTableColumn<T>[];
  const col = allCols.find((c) => String(c.key) === item.value);
  if (col) selectField(col);
};

const unwindToPanel = (panelIndex: number) => {
  if (panelIndex === 0) {
    lockedField.value = null;
    lockedOperator.value = null;
    lockedDate1.value = null;
    lockedSteps.value = [];
    inputValue.value = "";
  } else if (panelIndex === 1 && lockedField.value) {
    lockedOperator.value = null;
    lockedDate1.value = null;
    lockedSteps.value = lockedSteps.value.slice(0, 1);
    inputValue.value =
      lockedField.value.type === "enum"
        ? `${lockedField.value.label}=`
        : `${lockedField.value.label}`;
  } else if (panelIndex === 2 && lockedField.value && lockedOperator.value) {
    lockedDate1.value = null;
    lockedSteps.value = lockedSteps.value.slice(0, 2);
    inputValue.value = `${lockedField.value.label}${lockedOperator.value}`;
  }
  nextTick(() => autocompleteRef.value?.focus());
};

const resetAutocomplete = () => {
  inputValue.value = "";
  lockedField.value = null;
  lockedOperator.value = null;
  lockedDate1.value = null;
  lockedSteps.value = [];
};

const { tryUnravel } = useFilterUnravel(table, {
  inputValue,
  lockedField,
  lockedOperator,
  lockedDate1,
  lockedSteps,
});

// Handle input text changes — detect shorthand patterns
const onModelUpdate = (raw: string) => {
  inputValue.value = raw;

  // Auto-submit on closing character
  if (raw.startsWith('"') && raw.endsWith('"') && raw.length > 2) {
    query.value = raw.slice(1, -1);
    page.value = 1;
    fetchData();
    resetAutocomplete();
    return;
  }
  if (raw.startsWith("(") && raw.endsWith(")") && raw.length > 2) {
    const kw = raw.slice(1, -1);
    if (validateKeywords(kw)) {
      keywords.value = kw;
      page.value = 1;
      fetchData();
      resetAutocomplete();
    }
    return;
  }

  if (lockedField.value) {
    if (!raw.startsWith(lockedPrefix.value)) {
      if (lockedDate1.value) {
        lockedDate1.value = null;
        lockedSteps.value = lockedSteps.value.slice(0, 2);
      } else if (lockedOperator.value) {
        lockedOperator.value = null;
        lockedSteps.value = lockedSteps.value.slice(0, 1);
      } else {
        lockedField.value = null;
        lockedSteps.value = [];
      }
    }
  }

  if (!lockedField.value) {
    const eqIndex = raw.indexOf("=");
    if (eqIndex > 0) {
      const fieldText = raw.slice(0, eqIndex);
      const col = enumColumns.value.find(
        (c) => c.label.toLowerCase() === fieldText.toLowerCase(),
      );
      if (col) {
        lockedField.value = col;
        lockedSteps.value = [
          { label: col.label, value: String(col.key), icon: "filter" },
        ];
        inputValue.value = `${col.label}=${raw.slice(eqIndex + 1)}`;
      }
    }

    const opMatch = raw.match(/^([^><]+)([><])(.*)$/);
    if (opMatch) {
      const [, fieldText, op, rest] = opMatch;
      const col = dateColumns.value.find(
        (c) => c.label.toLowerCase() === fieldText!.toLowerCase(),
      );
      if (col) {
        lockedField.value = col;
        lockedOperator.value = op!;
        lockedSteps.value = [
          { label: col.label, value: String(col.key), icon: "calendar" },
          { label: op === ">" ? "> After" : "< Before", value: op! },
        ];
        inputValue.value = `${col.label}${op}${rest}`;
      }
    }
  }

  if (!lockedField.value) {
    const allFilterable = [...enumColumns.value, ...dateColumns.value];
    const search = raw.toLowerCase();
    const exactMatch = allFilterable.find(
      (c) => c.label.toLowerCase() === search,
    );
    if (exactMatch && suggestions.value.length === 1) {
      selectField(exactMatch);
    }
  }
};

// Handle Enter with no active suggestion — shorthand parsing
const onSubmit = (value: string) => {
  if (value.startsWith('"') && value.endsWith('"') && value.length > 2) {
    query.value = value.slice(1, -1);
    page.value = 1;
    fetchData();
    resetAutocomplete();
    return;
  }
  if (value.startsWith("(") && value.endsWith(")") && value.length > 2) {
    const kw = value.slice(1, -1);
    if (!validateKeywords(kw)) return;
    keywords.value = kw;
    page.value = 1;
    fetchData();
    resetAutocomplete();
    return;
  }
  const result = parseShorthand(value, columns as DataTableColumn<T>[]);
  if (result) {
    addFilter(result.filter);
    resetAutocomplete();
  }
};

// Handle forwarded keydown — Escape and Backspace
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    resetAutocomplete();
    return;
  }

  if (event.key === "Backspace") {
    if (lockedField.value) {
      if (lockedDate1.value) {
        const prefix = lockedPrefix.value;
        if (inputValue.value === prefix) {
          event.preventDefault();
          lockedDate1.value = null;
          lockedSteps.value = lockedSteps.value.slice(0, 2);
          inputValue.value = `${lockedField.value.label}${lockedOperator.value}`;
        }
      } else if (lockedOperator.value) {
        const prefix = `${lockedField.value.label}${lockedOperator.value}`;
        if (inputValue.value === prefix) {
          event.preventDefault();
          lockedOperator.value = null;
          lockedSteps.value = lockedSteps.value.slice(0, 1);
          inputValue.value = prefix.slice(0, -1);
        }
      } else {
        const prefix = lockedPrefix.value;
        if (inputValue.value === prefix) {
          event.preventDefault();
          lockedField.value = null;
          lockedSteps.value = [];
          inputValue.value = prefix.slice(0, -2);
        }
      }
    } else if (!inputValue.value && filters.value.length) {
      event.preventDefault();
      tryUnravel();
    }
  }
};

// Keyboard shortcut
const keys = useMagicKeys();
const combo = computed(() => keys["Meta+/"]?.value || keys["Ctrl+/"]?.value);
whenever(combo, () => {
  autocompleteRef.value?.focus();
});

</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-table-filters"
    v-on="rootPT.handlers"
  >
    <Group
      v-bind="chipsPT.props"
      class="f-data-table-filters-chips"
      v-on="chipsPT.handlers"
    >
      <Icon
        v-bind="iconPT.props"
        class="f-data-table-filters-icon"
        v-on="iconPT.handlers"
      />
      <Chip
        v-for="(filter, index) in filters"
        :key="index"
        v-bind="
          passthrough(pt?.chip, {
            props: { label: formatFilter(filter, columns), closable: true },
            handlers: {},
          }).props
        "
        @click="removeFilter(index)"
      />
      <Group
        v-bind="inputWrapPT.props"
        class="f-data-table-filters-input-wrap"
        v-on="inputWrapPT.handlers"
      >
        <Autocomplete
          ref="autocomplete"
          :model-value="inputValue"
          :suggestions="suggestions"
          :steps="lockedSteps"
          :hint="closingHint"
          :show-empty="showEmptyState"
          placeholder="Filter..."
          :pt="pt?.autocomplete"
          @update:model-value="onModelUpdate"
          @select="onSelect"
          @unwind="unwindToPanel"
          @submit="onSubmit"
          @keydown="onKeydown"
        />
      </Group>
      <DataTableFilterHelp :columns="columns" :pt="pt?.help" />
    </Group>
  </Group>
</template>
