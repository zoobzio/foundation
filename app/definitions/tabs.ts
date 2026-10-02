import type { TabsEmits, TabsOption, TabsProps } from "../types/core/tabs";
import type { Definition } from "../types/definition";

/**
 * A tabs instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type TabsDefinition<T extends TabsOption = TabsOption> = Definition<
  TabsProps<T>,
  TabsEmits
>;

/**
 * Declares a tabs at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineTabs = <T extends TabsOption>(
  definition: TabsDefinition<T>,
): TabsDefinition<T> => definition;
