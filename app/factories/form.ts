import type { Actions, Events } from "../types/data/form";
import type { FormWidgetProps } from "../types/data/form/widget";
import type { FormDefinition } from "../definitions/form";
import type { Widget } from "../types/widget";
import type { MaybeRefOrGetter } from "vue";

import component from "../components/data/form/widget.vue";

import { rekey } from "objectively";
import { accessForm } from "../stores/form";
import { toValue, useNuxtApp } from "#imports";
import { FormService } from "../services/form";
import { merge } from "../utils/merge";

/**
 * The behavior half of a form, attached in setup: the optional init/submit
 * lifecycle, per-key value middleware, and the reactive pt override merged
 * over the definition's base. All optional — a local-only form wires
 * nothing.
 */
export type FormWiring<T> = {
  init?: Actions<T>["init"];
  submit?: Actions<T>["submit"];
  middleware?: Actions<T>["middleware"];
  pt?: MaybeRefOrGetter<FormWidgetProps<T>["pt"]>;
};

/**
 * Instances a definition in the calling scope — call in setup: `id` is the
 * only thing the composable adds; shared state, hook scoping, wiring
 * identity all key on it. `T` infers from the definition's stamp (falling
 * back to the schema for unstamped definitions). Settings resolve wiring
 * pt over definition pt per key (widget recipes are the third layer,
 * merged in the component); the getter keeps a reactive wiring pt live.
 */
export const useForm = <T>(
  id: string,
  definition: FormDefinition<T>,
  wiring: FormWiring<T> = {},
): Widget<FormWidgetProps<T>, Events<T>> => {
  const nuxt = useNuxtApp();
  const state = accessForm(id, definition);
  const service = new FormService(nuxt, id, definition, state, wiring);
  return {
    service,
    component,
    settings: () =>
      rekey<Record<string, unknown>, NonNullable<FormWidgetProps<T>["pt"]>>(
        merge(toValue(wiring.pt) ?? {}, definition.pt ?? {}),
        (key, value) => [key, value],
      ),
  };
};
