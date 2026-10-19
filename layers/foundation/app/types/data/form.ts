/**
 * The form domain contract lives in the headless `@zoobzio/form` package.
 * Re-exported here so layer modules and consumers keep one import path.
 */
export type {
  Actions,
  Change,
  Changes,
  CheckboxField,
  Colspan,
  Config,
  DateField,
  Event,
  FailureStage,
  Field,
  FieldBase,
  Keys,
  Listener,
  Middleware,
  MultiSelectField,
  NumberField,
  Options,
  RadioField,
  SelectField,
  Service,
  State,
  StateKey,
  TagsInputField,
  TextareaField,
  TextField,
} from "@zoobzio/form";

export type { Events as ServiceEvents } from "@zoobzio/form";

/**
 * The Nuxt hook map of a form: the service's domain events, prefixed and
 * id-scoped, as `useForm` relays them onto the app hook bus.
 */
export type Events<T> = {
  "form:initialized": (event: { id: string; data: Partial<T> }) => void;
  "form:submitted": (event: { id: string; data: Partial<T> }) => void;
  "form:rejected": (event: {
    id: string;
    data: Partial<T>;
    errors: Record<string, string>;
  }) => void;
  "form:restored": (event: { id: string; data: T }) => void;
  "form:reset": (event: { id: string; data: Partial<T> }) => void;
  "form:failed": (event: {
    id: string;
    stage: "init" | "restore" | "submit";
    cause: unknown;
  }) => void;
};
