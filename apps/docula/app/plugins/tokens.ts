import * as tokenModules from "../tokens";

export default defineNuxtPlugin(() => {
  Object.values(tokenModules)
    .flat()
    .forEach(({ key, tokens }) => defineTokens(key, tokens));
});
