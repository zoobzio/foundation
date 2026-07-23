import { defineComponentTokens } from "#modules/tokens/config";

/**
 * Dev-only component-token schema.
 *
 * Consumed by the `dtcg` module ONLY when foundation is the root project (i.e.
 * you are developing the library itself, not extending it). It simulates a
 * consumer configuration so component tokens actually infer during development.
 * Never shipped: real consumers supply their own `dtcg` config and this stub is
 * ignored.
 */
export default defineComponentTokens({
  button: {
    bg: "primary-500",
    fg: "primary-50",
  },
});
