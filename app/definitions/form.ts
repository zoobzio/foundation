import type { Actions, Config } from "#foundation/types/data/form";
import type { FormWidgetProps } from "#foundation/types/data/form/widget";
import type { WidgetSettings } from "#foundation/types/widget";

/**
 * The static description `createForm` instances: everything about the
 * feature except its id. Reusable — one definition, many ids, many machines.
 */
export type FormDefinition<T> = {
  config: Config<T>;
  actions: Actions<T>;
  settings?: WidgetSettings<FormWidgetProps<T>>;
};

/**
 * Declares a form at module scope — pure data plus consumer callbacks,
 * no runtime, no Vue. The identity function is the type checkpoint: the
 * generics infer from `config`, and every field errors on the line it is
 * written.
 */
export const defineForm = <T>(
  definition: FormDefinition<T>,
): FormDefinition<T> => definition;
