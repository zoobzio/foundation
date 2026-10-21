import type { CommandDefinition, CommandOption } from "../types/core/command";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a command. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineCommand<T extends CommandOption>(
  definition: CommandDefinition<T>,
): CommandDefinition<T>;
export function defineCommand<T extends CommandOption>(
  definition: DefinitionSource<CommandDefinition<T>>,
): ComputedRef<CommandDefinition<T>>;
export function defineCommand<T extends CommandOption>(
  definition: CommandDefinition<T> | DefinitionSource<CommandDefinition<T>>,
): CommandDefinition<T> | ComputedRef<CommandDefinition<T>> {
  return define(definition);
}
