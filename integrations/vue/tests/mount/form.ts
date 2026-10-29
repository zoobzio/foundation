import type { Actions, Config, State } from "@zoobzio/form";
import type { FakePayload } from "#test/data/form";

import { reactive } from "vue";
import { FormService, createFormState } from "@zoobzio/form";
import { fakeDefaults, fakeFields, fakeSchema } from "#test/data/form";

/**
 * A real form service over a reactive container, seeded with a valid
 * payload. The shape every consumer builds.
 */
export const makeForm = (
  config: Partial<Config<FakePayload>> = {},
  wiring: Actions<FakePayload> = {},
) => {
  const full: Config<FakePayload> = {
    fields: fakeFields,
    schema: fakeSchema,
    defaults: fakeDefaults,
    ...config,
  };
  const state: State<FakePayload> = reactive(createFormState(full));
  const service = new FormService<FakePayload>(
    "test-form",
    full,
    state,
    wiring,
  );
  return { service, state };
};
