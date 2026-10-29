import type { MaybeRefOrGetter } from "vue";

import { useMagicKeys, whenever } from "@vueuse/core";
import { toValue } from "vue";

/**
 * Where a keypress is already text: a field, a text area, a select, or an
 * editable region. A key pressed in one of these belongs to it.
 */
const EDITABLE =
  "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

const MODIFIERS = ["control", "meta", "alt"];

const editing = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest(EDITABLE) !== null;

/**
 * Focuses `target` when `key` is pressed on its own, anywhere on the page
 * the user is not already typing. The listener is the window's, through
 * `useMagicKeys`, and is removed with the calling component. A press the
 * composable claims is cancelled, so the key does not land in the field it
 * focuses; a press with a modifier held, or inside an editable element, is
 * left to its own handler. Where two callers share a key, the last mounted
 * takes the focus.
 *
 * @param target - The element to focus, or a source of it.
 * @param key - The key, as `KeyboardEvent.key` names it (`/`).
 */
export const useFocusKey = (
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  key: string,
): void => {
  const claims = (event: KeyboardEvent): boolean =>
    event.type === "keydown" &&
    event.key === key &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !editing(event.target);

  const keys = useMagicKeys({
    passive: false,
    onEventFired: (event) => {
      if (claims(event)) event.preventDefault();
    },
  });

  whenever(
    () => keys[key]?.value === true,
    () => {
      if (MODIFIERS.some((modifier) => keys.current.has(modifier))) return;
      if (editing(document.activeElement)) return;
      toValue(target)?.focus();
    },
    { flush: "sync" },
  );
};
