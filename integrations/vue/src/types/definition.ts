import type { Passthrough } from "./passthrough";
import type { Ref } from "vue";

/**
 * A component instance as data: its props plus emit listeners in `on*` form.
 * A template binds it with `v-bind`.
 */
export type Definition<Props, Emits = {}> = Passthrough<Props, Emits>;

/**
 * A ref or getter that yields a definition.
 */
export type DefinitionSource<D> = Ref<D> | (() => D);
