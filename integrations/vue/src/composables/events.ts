import type { ServiceEmit, Subscribable } from "../types/service";

import { onScopeDispose } from "vue";

/**
 * Relays the named events of a service as component emits, under the same
 * names and with the same payloads, for the life of the current scope.
 *
 * @param service - The service or emitter to subscribe to.
 * @param events - The event names to relay. The component must declare
 * each one, with the service's payload.
 * @param emit - The component's `defineEmits` return.
 */
export const useServiceEmits = <const E extends string>(
  service: NoInfer<Subscribable<E>>,
  events: readonly E[],
  emit: NoInfer<ServiceEmit<E>>,
): void => {
  const offs = events.map((event) =>
    service.on(event, (...args) => emit(event, ...args)),
  );
  onScopeDispose(() => {
    for (const off of offs) off();
  });
};
