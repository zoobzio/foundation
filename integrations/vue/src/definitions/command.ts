import type { CommandDefinition, CommandOption } from "../types/core/command";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a command definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
