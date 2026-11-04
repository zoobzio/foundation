import type { Contract } from "#build/prosary/index.mjs";
import type { Text } from "@zoobzio/kit";
import type { Prosary } from "prosary";

/**
 * The app's prosary service, over its contract: what `@prosary/nuxt`
 * provides as `$prosary` (and names `AppProsary` on `#imports`).
 */
type AppProsary = Prosary<Contract>;

/**
 * The properties that carry text in the data the components and the
 * services take: what {@link resolveTexts} resolves, wherever it finds one.
 */
const TEXT_KEYS: ReadonlySet<string> = new Set([
  "label",
  "description",
  "title",
  "placeholder",
  "hint",
  "text",
]);

/**
 * Whether a value is a message of the app's contract: a key it declares,
 * or such a key with its values. Any other string is data — a file name, a
 * value — and stands as it is.
 */
const isMessage = (
  service: AppProsary,
  value: unknown,
): value is Parameters<AppProsary["format"]>[0] =>
  typeof value === "string"
    ? service.schema.check.key(value)
    : Array.isArray(value) && service.schema.check.key(value[0]);

/**
 * A plain object: what the data the components take is made of, as against
 * a Date, a class instance or a DOM node, which pass through untouched.
 */
const plain = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) return false;
  const proto: unknown = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * Resolves one text through the app's prosary service: a message of the
 * contract — a key, or a key with its values — formats in the active
 * locale, and any other string stands as it is. What the components
 * render is always a string; what reaches them is resolved here, at the
 * layer's boundary.
 *
 * @param service - The app's prosary service.
 * @param text - A plain string, a key of the contract, or a key with its
 * values. Any other value renders in its string form.
 * @returns The string to render.
 */
export const resolveText = (
  service: AppProsary,
  text: Text | unknown,
): string => (isMessage(service, text) ? service.format(text) : String(text));

/**
 * Resolves every text in a value: the `label`, `description`, `title`,
 * `placeholder`, `hint` and `text` of each plain object, at any depth of
 * arrays and plain objects, so the options of a select, the groups of a
 * menu, the nodes of a tree or the columns of a table all resolve in one
 * call. Anything else — a function, a Date, a service — is kept as it is.
 * The result is a copy; the value given is never written.
 *
 * @param service - The app's prosary service.
 * @param value - The data to resolve.
 * @returns The data, with every text a string.
 */
export function resolveTexts<T>(service: AppProsary, value: T): T;
export function resolveTexts(service: AppProsary, value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item: unknown) => resolveTexts(service, item));
  }
  if (!plain(value)) return value;
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    out[key] =
      TEXT_KEYS.has(key) && (typeof item === "string" || Array.isArray(item))
        ? resolveText(service, item)
        : resolveTexts(service, item);
  }
  return out;
}
