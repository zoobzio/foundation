import type { ServiceRefs } from "#foundation/types/refs";

import { computed } from "#imports";
import { entries, rekey } from "objectively";

type Accessor = {
  get: () => unknown;
  set?: (value: unknown) => void;
};

/**
 * The generic facade: mirrors a service's state surface as refs, storeToRefs
 * style, so consumers can destructure without losing reactivity.
 *
 * Prototype accessors become computeds — writable when the class declares a
 * setter, which keeps every write routed through the service's middleware.
 * Own data fields (id, config) are mirrored with live reads but only
 * invalidate if something they read is reactive. Methods are excluded from
 * the type: call them on the service itself, where they keep their `this`.
 */
export const useServiceRefs = <S extends object>(
  service: S,
): ServiceRefs<S> => {
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
