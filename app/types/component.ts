import type { AriaProps } from "./aria";
import type { Element } from "./element";
import type { ModifierProps } from "./modifiers";
import type { TokenProps } from "./tokens";

/**
 * The full prop surface a component of type `C` contributes to its call site:
 * the aria, token, and modifier halves, intersected.
 *
 * Props only — native-event emits are deliberately excluded. `EventEmits`
 * must be instantiated with literal event names for `@vue/compiler-sfc` to
 * fold the emit keys (see `types/events.ts`), so emits stay per-component on
 * `defineEmits` and cannot pass through this generic.
 */
export type ComponentProps<C extends Element> = AriaProps<C> &
  TokenProps<C> &
  ModifierProps<C>;
