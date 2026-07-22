import { defineModifiers } from "#modules/modifiers/config";

/**
 * Dev-only modifier schema.
 *
 * Consumed by the `modifiers` module ONLY when foundation is the root project
 * (i.e. you are developing the library itself, not extending it). It simulates
 * a consumer configuration so component modifier types actually infer during
 * development — otherwise every component's modifiers resolve to `never` and
 * there is nothing to see. Never shipped: real consumers supply their own
 * `modifiers` config and this stub is ignored.
 */
export default defineModifiers({
  button: {
    variant: ["solid", "outline", "ghost"],
    tone: ["primary", "danger"],
  },
});
