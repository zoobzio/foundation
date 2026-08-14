import type { AriaProps } from "./aria";
import type { ModifierProps } from "./modifiers";
import type { TokenProps } from "./tokens";
import type components from "../../config/components";

export type Element = keyof typeof components.elements;

export type Compound = keyof typeof components.compounds;

export type Component = Element | Compound;

/**
 * The full prop surface a component of type `C` contributes to its call site:
 * the aria, token, and modifier halves the `contracts` module and the direct
 * mapped types produce, intersected.
 *
 * Props only — native-event emits are deliberately excluded. `ComponentEvents`
 * must be indexed with a literal for `@vue/compiler-sfc` to fold the emit keys
 * (see `types/events.ts`), so emits stay per-component on `defineEmits` and
 * cannot pass through this generic.
 */
export type ComponentProps<C extends Element> = AriaProps<C> &
  TokenProps<C> &
  ModifierProps<C>;
