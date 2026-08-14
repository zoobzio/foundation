import type { DirectoryEmits, DirectoryItem, DirectoryProps } from "#foundation/types/core/directory";
import type { Definition } from "#foundation/types/definition";

/**
 * A directory instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DirectoryDefinition<T extends DirectoryItem> = Definition<
  DirectoryProps<T>,
  DirectoryEmits<T>
>;

/**
 * Declares a directory at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineDirectory = <T extends DirectoryItem>(
  definition: DirectoryDefinition<T>,
): DirectoryDefinition<T> => definition;
