import { createDefu } from "defu";

export const merge: (
  user: Record<string, unknown>,
  local: Record<string, unknown>,
) => Record<string, unknown> = createDefu((object, key, value) => {
  if (Array.isArray(object[key]) && Array.isArray(value)) {
    object[key] = value;
    return true;
  }
});
