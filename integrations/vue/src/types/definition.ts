import type { Passthrough } from "./passthrough";
import type { Ref } from "vue";

/**
 * A component instance as data: props plus emit listeners in `on*` form —
 * the object a template `v-bind`s, and the shape an adapter captures as its
 * settings. `define*` is the stable authoring verb across layers; only the
 * definition's shape changes with the layer (composites bind props, data
 * features bundle config/actions/settings, structures arrange registries,
 * adapters capture components).
 */
export type Definition<Props, Emits = {}> = Passthrough<Props, Emits>;

/**
 * The reactive authoring form of a definition: a ref or getter yielding it.
 * A composite `define*` given a source returns a computed definition, so a
 * reactive instance needs no hand-rolled `computed` wrapper.
 */
export type DefinitionSource<D> = Ref<D> | (() => D);
