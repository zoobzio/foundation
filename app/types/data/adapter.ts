import type { Definition } from "#foundation/types/definition";
import type { ScopedEvent } from "#foundation/types/hook";
import type { Ref } from "#imports";

/**
 * An adapter contract IS a definition — a component's Props/Emits pair in
 * `v-bind` form (`Definition<DirectoryProps<T>, DirectoryEmits<T>>`), the
 * encoding `EmitName` recovers. Re-exported under the adapter's vocabulary:
 * the contract is the definition the adapter enforces against a component.
 */
export type Contract<Props, Emits = {}> = Definition<Props, Emits>;

/**
 * The component being adapted: anything accepting props `P`. Both encodings
 * are needed — plain SFCs export a constructable component type, generic
 * SFCs export a call signature.
 *
 * `P` is the adapter's **contract**: pass it explicitly to `createAdapter`
 * to author the surface (props checked, emit names and payloads exact), or
 * omit it and inherit the component's own `$props`. A component whose props
 * don't satisfy the contract fails on the `component` property.
 */
export type Wrapped<P> =
  | (new (...args: never[]) => { $props: P })
  | ((props: P, ...args: never[]) => unknown);

/**
 * The contract's emit vocabulary, recovered from its listener props
 * (`onSelect` → `"select"`). Framework vnode hooks are excluded — they are
 * render plumbing, not component emits.
 */
export type EmitName<P> = keyof {
  [K in keyof P as K extends `onVnode${string}`
    ? never
    : K extends `on${infer N}`
      ? Uncapitalize<N>
      : never]: P[K];
} & string;

type EmitArgs<P, N extends string> = `on${Capitalize<N>}` extends infer K
  ? K extends keyof P
    ? NonNullable<P[K]> extends (...args: infer A) => unknown
      ? A
      : never
    : never
  : never;

/**
 * The bridge payload at the contract's emit names: a discriminated union so
 * wire handlers narrow on `emit` and receive the contract's own argument
 * tuple.
 */
export type Emitted<P> = {
  [K in EmitName<P>]: { emit: K; args: EmitArgs<P, K & string> };
}[EmitName<P>];

/**
 * Consumer-declared description of the adaptation. `emits` must acknowledge
 * every emit the contract declares — exhaustive by construction, so the
 * typed wire surface and the runtime bridge cannot drift. A contract with
 * no listener props states its empty bridge as `emits: {}`.
 */
export type Config<P> = {
  component: Wrapped<P>;
  emits: { [K in EmitName<P>]: true };
};

/**
 * The imperative props override layer — what `patch` writes and the widget
 * merges over the captured settings.
 */
export type State<P> = {
  props: Ref<Partial<P>>;
};

/**
 * The adapter's machine: identity, the captured component, and imperative
 * control over the wrapped component's props. `patch` is flat — last write
 * wins per prop; component props are not part manifests, so no deep merge.
 * `emitted` is the widget's bridge to the hook bus, not a consumer surface.
 */
export type Service<P> = {
  readonly id: string;
  readonly component: Wrapped<P>;
  readonly emits: readonly EmitName<P>[];
  readonly props: Partial<P>;
  patch(props: Partial<P>): void;
  reset(): void;
  emitted(emit: EmitName<P>, args: unknown[]): void;
};

/**
 * The typed events phantom at the factory's concrete contract — definition wiring
 * recovers the `Emitted` union from it. Empty when the contract declares no
 * emits, so an unbridged adapter offers no wire surface. `patch`/`reset`
 * deliberately emit nothing: prop control is coordination plumbing, and a
 * domain event there invites wire feedback loops.
 */
export type Events<P> = [EmitName<P>] extends [never]
  ? {}
  : {
      "adapter:emitted": (event: ScopedEvent & Emitted<P>) => void;
    };

/**
 * The erased bridge event the hooks registry carries (`app.d.ts`) — one
 * entry for every adapter; typed narrowing rides the widget phantom instead.
 */
export type AnyEvents = {
  "adapter:emitted": (
    event: ScopedEvent & { emit: string; args: unknown[] },
  ) => void;
};
