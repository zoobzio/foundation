/**
 * The preview domain contract lives in the headless `@zoobzio/preview`
 * package. Re-exported here so layer modules and consumers keep one import
 * path.
 */
export type {
  Actions,
  Change,
  Changes,
  CodeContentVariant,
  Config,
  ContentVariant,
  Event,
  Listener,
  Middleware,
  Options,
  PreviewField,
  PreviewFieldType,
  Service,
  State,
  StateKey,
} from "@zoobzio/preview";

export type { Events as ServiceEvents } from "@zoobzio/preview";

/**
 * The Nuxt hook map of a preview: the service's domain events, prefixed and
 * id-scoped, as `usePreview` relays them onto the app hook bus.
 */
export type Events = {
  "preview:loaded": (event: { id: string }) => void;
};
