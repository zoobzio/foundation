// The vue form with the layer's FormField rendering each field, so every
// control draws its icons.
import Core from "@zoobzio/vue/components/form.vue";

import { wrap } from "@zoobzio/vue/utils/wrap";
import FormField from "./form-field";

export default wrap(Core, {
  pt: { field: () => ({ as: FormField }) },
});
