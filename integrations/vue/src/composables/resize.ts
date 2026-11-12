import { ref } from "vue";

import { RESIZE_STEP } from "../constants/resize";

/**
 * Resizing of keyed items along the inline axis, by a handle on each
 * item's trailing edge. Owns the resize state and the pointer and keyboard
 * handlers. Commits each width through `resize`, as the pointer moves.
 *
 * A handle is a direct child of the item it resizes: a resize of an item
 * without a width starts from the rendered width of the handle's parent.
 * The pointer is captured for the length of a drag, so the handle keeps
 * receiving it outside its own box. In a right-to-left context the
 * trailing edge is the left one, and the deltas flip.
 *
 * `handleAttrs` bundles the listeners of a handle, for a `v-bind` spread.
 *
 * @param width - The current width of `key` in pixels, if it has one.
 * @param resize - Commits a width for `key`. Clamping is the caller's.
 * @param reset - Restores the width of `key`, on a double click or Enter.
 */
export const useResize = (
  width: (key: string) => number | undefined,
  resize: (key: string, width: number) => void,
  reset?: (key: string) => void,
) => {
  const resizeKey = ref<string | null>(null);

  let pointer: { id: number; x: number; width: number; sign: 1 | -1 } | null =
    null;

  const isResizing = (key: string) => resizeKey.value === key;

  const sign = (el: Element): 1 | -1 =>
    getComputedStyle(el).direction === "rtl" ? -1 : 1;

  const measure = (key: string, handle: Element): number =>
    width(key) ?? handle.parentElement?.getBoundingClientRect().width ?? 0;

  const onPointerDown = (key: string, event: PointerEvent) => {
    if (event.button !== 0) return;
    const handle = event.currentTarget;
    if (!(handle instanceof Element)) return;
    // No text selection, and no drag of a draggable ancestor.
    event.preventDefault();
    event.stopPropagation();
    handle.setPointerCapture?.(event.pointerId);
    pointer = {
      id: event.pointerId,
      x: event.clientX,
      width: measure(key, handle),
      sign: sign(handle),
    };
    resizeKey.value = key;
  };

  const onPointerMove = (key: string, event: PointerEvent) => {
    if (!pointer || pointer.id !== event.pointerId || !isResizing(key)) return;
    resize(key, pointer.width + (event.clientX - pointer.x) * pointer.sign);
  };

  const onPointerEnd = (event: PointerEvent) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    pointer = null;
    resizeKey.value = null;
  };

  const onKeyDown = (key: string, event: KeyboardEvent) => {
    const handle = event.currentTarget;
    if (!(handle instanceof Element)) return;
    if (event.key === "Enter" && reset) {
      event.preventDefault();
      reset(key);
      return;
    }
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? RESIZE_STEP : -RESIZE_STEP;
    resize(key, measure(key, handle) + delta * sign(handle));
  };

  const handleAttrs = (key: string) => ({
    onPointerdown: (event: PointerEvent) => onPointerDown(key, event),
    onPointermove: (event: PointerEvent) => onPointerMove(key, event),
    onPointerup: onPointerEnd,
    onPointercancel: onPointerEnd,
    onKeydown: (event: KeyboardEvent) => onKeyDown(key, event),
    onDblclick: () => reset?.(key),
  });

  return {
    resizeKey,
    isResizing,
    onPointerDown,
    onPointerMove,
    onPointerEnd,
    onKeyDown,
    handleAttrs,
  };
};
