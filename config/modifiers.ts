import type components from "./components";

/**
 * The modifier schema: each component's variant axes, keyed by axis name, each
 * axis the closed set of values its knob may take.
 *
 * Author-owned, like the rest of the component contracts — a component earns
 * an entry when it has designed variants, and components absent here have none
 * (their `Modifiers` type resolves to `never`). Keys are constrained to the
 * element registry; `ComponentModifiers` in `app/types/modifiers.ts` derives
 * directly from this const, so the axes and values flow into `ModifierProps`
 * and `ModifierBindings` with no generation step.
 */
export default {
  button: {
    variant: ["solid", "outline", "ghost"],
    tone: ["primary", "danger"],
  },
  "toast-root": {
    variant: ["info", "success", "warning", "error"],
  },
} as const satisfies Partial<
  Record<keyof typeof components.elements, Record<string, readonly string[]>>
>;
