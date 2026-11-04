// The vue form with the layer's FormField rendering each field, and its
// footer — the reset and submit buttons — in the visitor's locale.
import Core from "@zoobzio/vue/components/form.vue";

import { h } from "vue";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { text } from "./text";
import FormField from "./form-field";

export default wrap(Core, {
  pt: { field: () => ({ as: FormField }) },
  slots: {
    footer: ({ form, settings }) => [
      h("div", { class: "f-group f-data-form-footer" }, [
        h(
          "button",
          { class: "f-button f-data-form-reset", ...settings.reset },
          text("form.reset"),
        ),
        h(
          "button",
          { class: "f-button f-data-form-submit", ...settings.submit },
          text(form.submitting ? "form.submitting" : "form.submit"),
        ),
      ]),
    ],
  },
});
