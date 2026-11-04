import type { Contract } from "#build/prosary/index.mjs";
import type { Message } from "prosary";

/**
 * A message of the app's contract, as data: its key alone when it takes no
 * values, or the key with its values. `@prosary/nuxt` builds the contract
 * at build time from the prose build the layer names, so inside the layer
 * it is `@zoobzio/prose` and inside an app it is the app's own build, which
 * extends it. What `Text` widens to under the layer, so a column, an
 * action, an item or a field takes any key of the app.
 */
export type AppMessage = Message<Contract>;
