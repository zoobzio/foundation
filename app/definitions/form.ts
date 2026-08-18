import type { Config } from "../types/data/form";
import type { FormWidgetProps } from "../types/data/form/widget";
import type { Stamp } from "../types/definition";

/**
 * The static description of a form — one flat record: the domain config
 * (title, fields, defaults, and the Zod schema — the form's intrinsic
 * contract, which travels with the definition rather than the wiring) plus
 * the passthrough base. Behavior — init/submit lifecycle, middleware,
 * reactive pt — attaches at `useForm`. Declared through an entity's
 * `defineForm`, which checks every field against the entity type on the
 * line it is written.
 */
export type FormDefinition<T> = Config<T> &
  Stamp<T> & {
    pt?: FormWidgetProps<T>["pt"];
  };
