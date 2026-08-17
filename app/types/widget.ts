import type { MaybeRefOrGetter } from "vue";

/**
 * The view half of a widget: a component that accepts its machine under the
 * uniform `service` prop and its settings under `pt`. Both encodings are
 * needed — plain SFCs export a constructable component type, generic SFCs
 * export a call signature.
 */
export type WidgetComponent<S, P> =
  | (new (...args: never[]) => { $props: { service: S; pt?: P } })
  | ((props: { service: S; pt?: P }, ...args: never[]) => unknown);

/**
 * The props contract every widget component implements: the machine plus the
 * passthrough tree its settings configure.
 */
export type WidgetProps = {
  service: unknown;
  pt?: unknown;
};

/**
 * Consumer-facing settings input for a widget: the component's full `pt`
 * tree, static or reactive. Resolve with `toValue` at the bind site.
 */
export type WidgetSettings<Props extends WidgetProps> = MaybeRefOrGetter<
  NonNullable<Props["pt"]>
>;

/**
 * The canonical widget — what a factory yields: the reactive service facade,
 * the component that renders it, and the consumer's reactive settings for the
 * component's passthrough tree. Generic over the component's props type,
 * which carries both the machine and the settings tree.
 *
 * `E` is the feature's domain event map at the factory's concrete generics —
 * the global hook registry erases them to `unknown`, so this phantom is where
 * definition wiring recovers typed payloads. Never set at runtime.
 */
export type Widget<Props extends WidgetProps, E = {}> = {
  service: Props["service"];
  component: WidgetComponent<Props["service"], NonNullable<Props["pt"]>>;
  settings?: WidgetSettings<Props>;
  events?: E;
};

/**
 * The erased widget — what structural components operate on. Every
 * `Widget<Props>` is assignable to it; correlation between the fields was
 * proven where the factory was authored, so render paths bind through this
 * view without re-checking. `widgets` is excluded so a `Structure` — a
 * composite of widgets, which carries a registry — can never pass as a
 * widget and occupy a slot.
 */
export type AnyWidget = {
  service: { id: string };
  component:
    | (new (...args: never[]) => { $props: unknown })
    | ((...args: never[]) => unknown);
  settings?: unknown;
  events?: unknown;
  widgets?: never;
};

/**
 * A widget registry: live widgets keyed by name, as assembled in the user's
 * composable from per-feature `use*` calls. Structural components are
 * generic over a literal `R extends Widgets` and recover per-key types via
 * `R[K]`; render paths widen to the erased record at the component boundary.
 */
export type Widgets = Record<string, AnyWidget>;
