import type { Service } from "@zoobzio/sync";
import type { MaybeRefOrGetter } from "vue";

import { onBeforeUnmount, onMounted, toValue, watch } from "vue";

/**
 * Watches a sync for as long as the component is on screen: from its
 * mount to its unmount, and only while the document is visible, so a tab
 * in the background asks for nothing. A document that comes back into
 * view polls at once where the sync is active, then keeps its interval.
 * Nothing runs on a server, where nothing mounts. A service with no sync
 * is left alone.
 *
 * @param source - The sync, or a ref or getter of it.
 */
export const useSync = (
  source: MaybeRefOrGetter<Service | undefined>,
): void => {
  let stop: (() => void) | undefined;

  const start = () => {
    stop ??= toValue(source)?.watch();
  };
  const end = () => {
    stop?.();
    stop = undefined;
  };

  const onVisibility = () => {
    if (document.hidden) {
      end();
      return;
    }
    start();
    const sync = toValue(source);
    if (sync?.active) void sync.poll();
  };

  onMounted(() => {
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("visibilitychange", onVisibility);
    end();
  });

  // A component handed another service watches that one's sync instead.
  watch(
    () => toValue(source),
    () => {
      if (!stop) return;
      end();
      start();
    },
  );
};
