import type { MaybeRefOrGetter } from "vue";

import { computed, ref, toValue } from "vue";

/**
 * Drag reordering of a keyed list over the native drag API. Owns the drag
 * state and the `DragEvent` handlers. Commits a move through `move`.
 *
 * `itemAttrs` and `handleAttrs` bundle the attributes and listeners for an
 * item and its handle, for a `v-bind` spread.
 *
 * @param order - The keys in their current order.
 * @param move - Commits `key` to the slot of `toKey`.
 * @param options.handle - When true, an item drags only while its handle is
 * armed. Otherwise every item drags.
 */
export const useDrag = (
  order: MaybeRefOrGetter<string[]>,
  move: (key: string, toKey: string) => void,
  options?: MaybeRefOrGetter<{ handle?: boolean }>,
) => {
  const armedKey = ref<string | null>(null);
  const dragKey = ref<string | null>(null);
  const dropKey = ref<string | null>(null);

  const dropSide = computed<"before" | "after" | null>(() => {
    if (!dragKey.value || !dropKey.value) return null;
    const keys = toValue(order);
    const from = keys.indexOf(dragKey.value);
    const to = keys.indexOf(dropKey.value);
    if (from === -1 || to === -1) return null;
    return from < to ? "after" : "before";
  });

  const isDraggable = (key: string) =>
    toValue(options)?.handle ? armedKey.value === key : true;
  const isDragging = (key: string) => dragKey.value === key;
  const dropSideFor = (key: string) =>
    dropKey.value === key ? dropSide.value : null;

  const arm = (key: string) => {
    armedKey.value = key;
  };

  const disarm = () => {
    if (!dragKey.value) armedKey.value = null;
  };

  const onDragStart = (key: string, event: DragEvent) => {
    dragKey.value = key;
    dropKey.value = null;
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (key: string, event: DragEvent) => {
    event.preventDefault();
    if (!dragKey.value || dragKey.value === key) return;
    dropKey.value = key;
  };

  // Only the current target clears itself. A leave fired by a child of
  // another item does not reset the indicator.
  const onDragLeave = (key: string) => {
    if (dropKey.value === key) dropKey.value = null;
  };

  const onDrop = (key: string, event: DragEvent) => {
    event.preventDefault();
    if (!dragKey.value) return;
    move(dragKey.value, key);
  };

  const onDragEnd = () => {
    dragKey.value = null;
    dropKey.value = null;
    armedKey.value = null;
  };

  const itemAttrs = (key: string) => ({
    draggable: isDraggable(key),
    onDragstart: (event: DragEvent) => onDragStart(key, event),
    onDragover: (event: DragEvent) => onDragOver(key, event),
    onDragleave: () => onDragLeave(key),
    onDrop: (event: DragEvent) => onDrop(key, event),
    onDragend: onDragEnd,
  });

  const handleAttrs = (key: string) => ({
    onMouseenter: () => arm(key),
    onMouseleave: disarm,
  });

  return {
    armedKey,
    dragKey,
    dropKey,
    dropSide,
    isDraggable,
    isDragging,
    dropSideFor,
    arm,
    disarm,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    itemAttrs,
    handleAttrs,
  };
};
