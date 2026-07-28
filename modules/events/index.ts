import { addTypeTemplate, defineNuxtModule } from "@nuxt/kit";
import { generateEventsTypes } from "#modules/events/template";

/**
 * Generates the native-event registry `ComponentEvents` from the per-component
 * `events` lists in `config/components`, mirroring how the `aria` module
 * generates `RoleAria` from the per-element `role` field. The config is the
 * semantic curation; the module lifts it into the literal interface that
 * `defineEmits` and the passthrough system resolve per component.
 */
export default defineNuxtModule({
  meta: {
    name: "events",
    configKey: "events",
  },
  setup() {
    addTypeTemplate({
      filename: "types/events.d.ts",
      write: true,
      getContents: () => generateEventsTypes(),
    });
  },
});
