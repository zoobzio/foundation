import type { CommandEmits, CommandOption, CommandProps } from "../types/core/command";
import type { Definition } from "../types/definition";

/**
 * A command instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type CommandDefinition<T extends CommandOption> = Definition<
  CommandProps<T>,
  CommandEmits<T>
>;

/**
 * Declares a command at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineCommand = <T extends CommandOption>(
  definition: CommandDefinition<T>,
): CommandDefinition<T> => definition;
