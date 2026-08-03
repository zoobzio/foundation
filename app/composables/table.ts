import type { Table } from "#foundation/types/data/table";
import type {
  CommandGroup,
  CommandOption,
} from "#foundation/types/core/command";
import type { MenuGroup, MenuItem } from "#foundation/types/core/menu";

import { computed, ref } from "#imports";

/**
 * The feature half of the table head: column-header drag reordering. Owns the
 * drag state and native `DragEvent` handlers, and commits new orders through
 * the machine.
 */
export const useTableHead = <T, K>(table: Table<T, K>) => {
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
    const order = table.columnOrder.value;
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

    const order = [...table.columnOrder.value];
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

  return {
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
  };
};

/**
 * The feature half of the column manager: bridges `columnOrder` and the
 * Command's option model, inserting toggled-on columns at their definition
 * position rather than the end.
 */
export const useTableColumns = <T, K>(table: Table<T, K>) => {
  const allKeys = table.columns.map((c) => String(c.key));

  const selected = computed<Set<string>>({
    get: () => new Set(table.columnOrder.value),
    set: (val) => {
      const current = table.columnOrder.value.filter((k) => val.has(k));
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

  const groups = computed<CommandGroup<CommandOption>[]>(() => [
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

  const selectedOptions = computed<CommandOption[]>(() =>
    groups.value
      .flatMap((g) => g.options)
      .filter((o) => selected.value.has(o.value)),
  );

  const onUpdate = (v: CommandOption[] | undefined) => {
    selected.value = new Set((v ?? []).map((o) => o.value));
  };

  return { groups, selectedOptions, onUpdate };
};

/**
 * The feature half of the table body: the per-row action menu descriptors and
 * the label→action dispatch.
 */
export const useTableBody = <T, K>(table: Table<T, K>) => {
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

  return { actionGroups, onActionSelect };
};
