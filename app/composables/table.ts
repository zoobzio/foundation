import type { DataTableColumn, Service } from "../types/data/table";
import type { AutocompleteOption } from "../types/core/autocomplete";
import type {
  CommandGroup,
  CommandOption,
} from "../types/core/command";
import type { MenuGroup, MenuItem } from "../types/core/menu";
import type { TableWidgetPassthrough } from "../types/data/table/widget";

import { computed, ref, watch } from "#imports";
import { useServiceRefs } from "./refs";

import {
  TABLE_DATE_OPERATORS,
  TABLE_NUMBER_OPERATORS,
  TABLE_SEARCH_LOOKAHEAD,
  TABLE_SEARCH_LOOKAHEAD_MAX_DEPTH,
  TABLE_SEARCH_PLACEHOLDER,
} from "../constants/table";

/**
 * The view surface of the table feature, shared by every table component:
 * the service's state as refs, the shared deriveds, column-header drag
 * reordering, the column manager's Command bridge, and the per-row action
 * menu dispatch. Each component destructures its slice.
 */
export const useTableView = <T>(table: Service<T>) => {
  const serviceRefs = useServiceRefs(table);

  // Shared deriveds
  const hasSelection = computed(() => table.selected.size > 0);
  const isSelectable = computed(() => table.bulkActions.length > 0);
  const hasActions = computed(() => table.actions.length > 0);

  // Column-header drag reordering — owns the drag state and native
  // `DragEvent` handlers, commits new orders through the machine.
  const draggableKey = ref<string | null>(null);
  const dragKey = ref<string | null>(null);
  const dropKey = ref<string | null>(null);

  const onDragHandleEnter = (key: string) => {
    draggableKey.value = key;
  };

  const onDragHandleLeave = () => {
    if (!dragKey.value) draggableKey.value = null;
  };

  const onHeaderDragStart = (key: string, event: DragEvent) => {
    dragKey.value = key;
    dropKey.value = null;
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  };

  const onHeaderDragOver = (key: string, event: DragEvent) => {
    event.preventDefault();
    if (!dragKey.value || dragKey.value === key) return;
    dropKey.value = key;
  };

  const dropDirection = computed(() => {
    if (!dragKey.value || !dropKey.value) return null;
    const order = table.columnOrder;
    const fromIdx = order.indexOf(dragKey.value);
    const toIdx = order.indexOf(dropKey.value);
    if (fromIdx === -1 || toIdx === -1) return null;
    return fromIdx < toIdx ? "right" : "left";
  });

  const onHeaderDragLeave = () => {
    dropKey.value = null;
  };

  const onHeaderDrop = (key: string, event: DragEvent) => {
    event.preventDefault();
    if (!dragKey.value || dragKey.value === key) return;

    const order = [...table.columnOrder];
    const fromIdx = order.indexOf(dragKey.value);
    const toIdx = order.indexOf(key);
    if (fromIdx === -1 || toIdx === -1) return;

    order.splice(fromIdx, 1);
    order.splice(toIdx, 0, dragKey.value);
    table.reorderColumns(order);
  };

  const onHeaderDragEnd = () => {
    dragKey.value = null;
    dropKey.value = null;
    draggableKey.value = null;
  };

  // Column manager — bridges `columnOrder` and the Command's option model,
  // inserting toggled-on columns at their definition position rather than
  // the end.
  const allKeys = table.columns.map((c) => String(c.key));

  const visibleKeys = computed<Set<string>>({
    get: () => new Set(table.columnOrder),
    set: (val) => {
      const current = table.columnOrder.filter((k) => val.has(k));
      const added = [...val].filter((k) => !current.includes(k));
      if (!added.length) {
        table.reorderColumns(current);
        return;
      }
      const result = [...current];
      for (const key of added) {
        const defIndex = allKeys.indexOf(key);
        let insertAt = result.length;
        for (let i = 0; i < result.length; i++) {
          const at = result[i];
          if (at !== undefined && allKeys.indexOf(at) > defIndex) {
            insertAt = i;
            break;
          }
        }
        result.splice(insertAt, 0, key);
      }
      table.reorderColumns(result);
    },
  });

  const columnGroups = computed<CommandGroup<CommandOption>[]>(() => [
    {
      key: "columns",
      label: "Columns",
      options: table.columns.map((c) => ({
        value: String(c.key),
        label: c.label,
        disabled: table.isColumnPinned(c.key),
      })),
    },
  ]);

  const selectedColumnOptions = computed<CommandOption[]>(() =>
    columnGroups.value
      .flatMap((g) => g.options)
      .filter((o) => visibleKeys.value.has(o.value)),
  );

  const onColumnsUpdate = (v: CommandOption[] | undefined) => {
    visibleKeys.value = new Set((v ?? []).map((o) => o.value));
  };

  // Search — the input text is the filter under construction: `Label: term`
  // is a column's value stage, `Label: op: term` an operator column's, and
  // anything else the column/free-text stage. Only a finished token reaches
  // the machine (chip + refetch). Option values are prefixed
  // (`col:` / `op:` / `val:`), chips keyed (`query` / `filter:<i>`).
  const searchInput = ref("");

  const columnByKey = new Map(table.columns.map((c) => [String(c.key), c]));

  const operatorsFor = (column: DataTableColumn<T>): readonly string[] => {
    switch (column.type) {
      case "date":
      case "datetime":
        return TABLE_DATE_OPERATORS;
      case "number":
      case "currency":
      case "filesize":
        return TABLE_NUMBER_OPERATORS;
      default:
        return [];
    }
  };

  const defaultOperatorFor = (
    column: DataTableColumn<T>,
  ): string | undefined => {
    switch (column.type) {
      case "date":
      case "datetime":
        return "on";
      case "number":
      case "currency":
      case "filesize":
        return "is";
      default:
        return undefined;
    }
  };

  const searchParse = computed(() => {
    const raw = searchInput.value;
    const idx = raw.indexOf(":");
    if (idx < 0) return { column: undefined, op: undefined, term: raw };
    const prefix = raw.slice(0, idx).trim().toLowerCase();
    const column = table.filterableColumns.find(
      (c) => c.label.toLowerCase() === prefix,
    );
    if (!column) return { column: undefined, op: undefined, term: raw };
    const rest = raw.slice(idx + 1).trimStart();
    const ops = operatorsFor(column);
    if (ops.length) {
      const j = rest.indexOf(":");
      if (j >= 0) {
        const op = ops.find((o) => o === rest.slice(0, j).trim().toLowerCase());
        if (op) return { column, op, term: rest.slice(j + 1).trimStart() };
      }
    }
    return { column, op: undefined, term: rest };
  });

  // Lookahead depth for generated value options: grows as the user scrolls
  // the panel toward its end, resets when the drill stage changes.
  const searchDepth = ref(1);

  const isoDate = (year: number, month: number, day: number): string =>
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Numbers: a typed anchor expands by magnitude (4 → 40 → 400 …); no anchor
  // walks a 1/2.5/5 ladder. Both extend with depth.
  const numberOptions = (term: string, count: number): string[] => {
    const n = Number(term);
    if (term && Number.isFinite(n) && n > 0) {
      return Array.from({ length: Math.min(count, 12) }, (_, k) =>
        String(n * 10 ** k),
      );
    }
    const out: string[] = ["0"];
    let decade = 10;
    while (out.length < count) {
      for (const m of [1, 2.5, 5]) {
        if (out.length >= count) break;
        out.push(String(m * decade));
      }
      decade *= 10;
    }
    return out;
  };

  // Dates: as much text as typed anchors the generation — a year lists its
  // months, a year-month its days, nothing lists days from today onward.
  const dateOptions = (term: string, count: number): string[] => {
    const t = term.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return [t];
    const ym = /^(\d{4})-(\d{1,2})$/.exec(t);
    if (ym) {
      const year = Number(ym[1]);
      const month = Number(ym[2]);
      if (month < 1 || month > 12) return [];
      const days = new Date(year, month, 0).getDate();
      return Array.from({ length: Math.min(days, count) }, (_, i) =>
        isoDate(year, month, i + 1),
      );
    }
    if (/^\d{4}$/.test(t)) {
      const year = Number(t);
      return Array.from({ length: Math.min(12, count) }, (_, i) =>
        isoDate(year, i + 1, 1),
      );
    }
    if (t) return [];
    const start = new Date();
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return isoDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    });
  };

  const valueOptions = (
    column: DataTableColumn<T>,
    term = "",
    count = TABLE_SEARCH_LOOKAHEAD,
  ): string[] => {
    switch (column.type) {
      case "boolean":
        return ["true", "false"];
      case "number":
      case "currency":
      case "filesize":
        return numberOptions(term.trim(), count);
      case "date":
      case "datetime":
        return dateOptions(term, count);
      default:
        return column.enumValues ?? [];
    }
  };

  const columnOptions = computed<AutocompleteOption<DataTableColumn<T>>[]>(
    () =>
      table.filterableColumns.map((c) => ({
        value: `col:${String(c.key)}`,
        label: c.label,
        hasChildren: true,
        meta: c,
      })),
  );

  const searchItems = computed<AutocompleteOption<DataTableColumn<T>>[]>(
    () => {
      const { column, op, term } = searchParse.value;
      const q = term.trim().toLowerCase();
      if (!column) {
        return columnOptions.value.filter(
          (c) => !q || c.label.toLowerCase().includes(q),
        );
      }
      const ops = operatorsFor(column);
      if (ops.length && !op) {
        return ops
          .filter((o) => !q || o.includes(q))
          .map((o) => ({
            value: `op:${o}`,
            label: o,
            hasChildren: true,
            meta: column,
          }));
      }
      // generated options already derive from the term; only literal value
      // lists (enum/boolean) need narrowing
      const generated =
        column.type === "number" ||
        column.type === "currency" ||
        column.type === "filesize" ||
        column.type === "date" ||
        column.type === "datetime";
      return valueOptions(
        column,
        term,
        TABLE_SEARCH_LOOKAHEAD * searchDepth.value,
      )
        .filter((v) => generated || !q || v.toLowerCase().includes(q))
        .map((v) => ({ value: `val:${v}`, label: v }));
    },
  );

  watch(
    () => {
      const { column, op } = searchParse.value;
      return `${column ? String(column.key) : ""}|${op ?? ""}`;
    },
    () => {
      searchDepth.value = 1;
    },
  );

  // Progressive: ancestor panels show only the path taken.
  const searchTrail = computed<AutocompleteOption<DataTableColumn<T>>[][]>(
    () => {
      const { column, op } = searchParse.value;
      if (!column) return [];
      const trail: AutocompleteOption<DataTableColumn<T>>[][] = [
        [
          {
            value: `col:${String(column.key)}`,
            label: column.label,
            hasChildren: true,
            active: true,
            meta: column,
          },
        ],
      ];
      if (op) {
        trail.push([
          {
            value: `op:${op}`,
            label: op,
            hasChildren: true,
            active: true,
            meta: column,
          },
        ]);
      }
      return trail;
    },
  );

  const searchHint = computed(() => {
    const { column, op, term } = searchParse.value;
    const q = term.toLowerCase();
    if (!q) return "";
    if (!column) {
      const match = table.filterableColumns
        .map((c) => c.label)
        .find((c) => c.toLowerCase().startsWith(q) && c.length > q.length);
      return match ? `${match.slice(q.length)}: ` : "";
    }
    const ops = operatorsFor(column);
    if (ops.length && !op) {
      const match = ops.find((o) => o.startsWith(q) && o.length > q.length);
      return match ? `${match.slice(q.length)}: ` : "";
    }
    const match = valueOptions(column, term).find(
      (v) => v.toLowerCase().startsWith(q) && v.length > q.length,
    );
    return match ? match.slice(q.length) : "";
  });

  const searchSteps = computed<AutocompleteOption<DataTableColumn<T>>[]>(
    () => {
      const steps: AutocompleteOption<DataTableColumn<T>>[] = [];
      if (table.query) {
        steps.push({ value: "query", label: `"${table.query}"` });
      }
      table.filters.forEach((f, i) => {
        const col = columnByKey.get(f.key);
        steps.push({
          value: `filter:${i}`,
          label: `${col?.label ?? f.key}: ${f.op ? `${f.op} ` : ""}${f.value}`,
          meta: col,
        });
      });
      return steps;
    },
  );

  const commitFilter = (column: DataTableColumn<T>, value: string) => {
    const op = searchParse.value.op ?? defaultOperatorFor(column);
    if (op) table.addFilter(String(column.key), value, op);
    else table.addFilter(String(column.key), value);
    searchInput.value = "";
  };

  const onSearchSelect = (item: AutocompleteOption<DataTableColumn<T>>) => {
    if (item.value.startsWith("col:")) {
      // clicking the drilled trail entry steps back out
      searchInput.value = item.active ? "" : `${item.meta?.label ?? ""}: `;
      return;
    }
    if (item.value.startsWith("op:")) {
      const label = item.meta?.label ?? "";
      searchInput.value = item.active
        ? `${label}: `
        : `${label}: ${item.value.slice("op:".length)}: `;
      return;
    }
    if (item.value.startsWith("val:")) {
      const { column } = searchParse.value;
      if (column) commitFilter(column, item.value.slice("val:".length));
    }
  };

  const onSearchSubmit = () => {
    const { column, term } = searchParse.value;
    const v = term.trim();
    if (column) {
      if (v) commitFilter(column, v);
      return;
    }
    if (v || table.query) {
      table.setQuery(v);
      searchInput.value = "";
    }
  };

  const onSearchMore = () => {
    if (searchDepth.value < TABLE_SEARCH_LOOKAHEAD_MAX_DEPTH) {
      searchDepth.value += 1;
    }
  };

  // Backspace on an empty input unwraps the last chip: the filter leaves
  // the machine and its token text lands back in the input minus the
  // consumed character, so chips erase like continuous text.
  const onSearchUnwrap = () => {
    const last = searchSteps.value.at(-1);
    if (!last) return;
    if (last.value === "query") {
      const text = table.query;
      table.setQuery("");
      searchInput.value = text.slice(0, -1);
      return;
    }
    if (last.value.startsWith("filter:")) {
      const index = Number(last.value.slice("filter:".length));
      const committed = table.filters[index];
      if (!committed) return;
      const col = columnByKey.get(committed.key);
      const text = `${col?.label ?? committed.key}: ${
        committed.op ? `${committed.op}: ` : ""
      }${committed.value}`;
      table.removeFilter(index);
      searchInput.value = text.slice(0, -1);
    }
  };

  // A chip maps to removal of what it represents.
  const onSearchUnwind = (index: number) => {
    const step = searchSteps.value[index];
    if (!step) return;
    if (step.value === "query") {
      table.setQuery("");
      return;
    }
    if (step.value.startsWith("filter:")) {
      const i = Number(step.value.slice("filter:".length));
      if (Number.isInteger(i)) table.removeFilter(i);
    }
  };

  const searchRecipes = computed<Pick<TableWidgetPassthrough<T>, "search">>(
    () => ({
      search: {
        items: searchItems.value,
        steps: searchSteps.value,
        trail: searchTrail.value,
        hint: searchHint.value,
        modelValue: searchInput.value,
        placeholder: TABLE_SEARCH_PLACEHOLDER,
        "onUpdate:modelValue": (v) => {
          searchInput.value = v;
        },
        onSelect: onSearchSelect,
        onSubmit: onSearchSubmit,
        onUnwind: onSearchUnwind,
        onMore: onSearchMore,
        onUnwrap: onSearchUnwrap,
      },
    }),
  );

  // Per-row action menu — descriptors and the label→action dispatch.
  const actionGroups = computed<MenuGroup[]>(() => [
    {
      key: "actions",
      items: table.actions.map((a) => ({ icon: a.icon, label: a.label })),
    },
  ]);

  const actionMap = new Map(table.actions.map((a) => [a.label, a]));

  const onActionSelect = (row: T, item: MenuItem) => {
    actionMap.get(item.label)?.action(row);
  };

  return {
    ...serviceRefs,
    hasSelection,
    isSelectable,
    hasActions,
    draggableKey,
    dragKey,
    dropKey,
    dropDirection,
    onDragHandleEnter,
    onDragHandleLeave,
    onHeaderDragStart,
    onHeaderDragOver,
    onHeaderDragLeave,
    onHeaderDrop,
    onHeaderDragEnd,
    columnGroups,
    selectedColumnOptions,
    onColumnsUpdate,
    searchRecipes,
    actionGroups,
    onActionSelect,
  };
};
