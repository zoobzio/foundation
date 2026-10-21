import type { Accessor, ServiceRefs } from "../types/refs";

import { computed } from "vue";
import { entries, rekey } from "objectively";

/**
 * Mirrors a service's state surface as refs, so a component can destructure
 * it without a loss of reactivity.
 *
 * Prototype accessors become computeds. A computed is writable when the
 * class declares a setter, so each write routes through the service. Own
 * data fields mirror with live reads. Methods are excluded from the type.
 * Call them on the service, where they keep their `this`.
 *
 * The computeds track only what the getters read. The service's state
 * container must be reactive for the view to update.
 */
export const useRefs = <S extends object>(service: S): ServiceRefs<S> => {
  const accessors: Record<string, Accessor> = {};

  for (const [key, descriptor] of entries(
    Object.getOwnPropertyDescriptors(service),
  )) {
    if (typeof descriptor.value === "function") continue;
    accessors[key] = { get: () => Reflect.get(service, key) };
  }

  let proto = Reflect.getPrototypeOf(service);
  while (proto && proto !== Object.prototype) {
    for (const [key, descriptor] of entries(
      Object.getOwnPropertyDescriptors(proto),
    )) {
      const { get, set } = descriptor;
      if (!get || key in accessors) continue;
      accessors[key] = {
        get: () => get.call(service),
        set: set && ((value) => set.call(service, value)),
      };
    }
    proto = Reflect.getPrototypeOf(proto);
  }

  return rekey<Record<string, Accessor>, ServiceRefs<S>>(
    accessors,
    (key, accessor) => [
      key,
      accessor.set
        ? computed({ get: accessor.get, set: accessor.set })
        : computed(accessor.get),
    ],
  );
};
