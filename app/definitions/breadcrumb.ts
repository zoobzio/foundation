import type {
  BreadcrumbEmits,
  BreadcrumbItem,
  BreadcrumbProps,
} from "../types/core/breadcrumb";
import type { Definition } from "../types/definition";

/**
 * A breadcrumb instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type BreadcrumbDefinition<T extends BreadcrumbItem> = Definition<
  BreadcrumbProps<T>,
  BreadcrumbEmits<T>
>;

/**
 * Declares a breadcrumb at module scope — pure data, no runtime, no Vue.
 * The identity function is the type checkpoint: every field errors on the
 * line it is written.
 */
export const defineBreadcrumb = <T extends BreadcrumbItem>(
  definition: BreadcrumbDefinition<T>,
): BreadcrumbDefinition<T> => definition;
