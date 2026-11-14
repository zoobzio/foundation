// The vue date filters with the layer's Command behind its field and
// operator steps, the layer's DateGrid and DateRangeGrid behind its value
// step, the `calendar` icon as its trigger's content, and its text — the
// trigger, the steps, the operators, the placeholders, the apply button —
// in the visitor's locale. The fields' labels resolve in the Command.
import Core from "@zoobzio/vue/components/date-filters.vue";

import { createTextVNode, h } from "vue";
import { iconPart } from "./icon";
import { text, textSlot } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import DateGrid from "./date-grid";
import Command from "./command";
import DateRangeGrid from "./date-range-grid";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    trigger: { label: text("dateFilters.trigger"), ...pt?.trigger },
    fieldCommand: {
      as: Command,
      placeholder: text("dateFilters.searchFields"),
      ...pt?.fieldCommand,
    },
    operatorCommand: {
      as: Command,
      placeholder: text("dateFilters.searchOperators"),
      groups: [
        {
          key: "operators",
          label: text("dateFilters.operators"),
          options: [
            { value: "after", label: text("dateFilters.after") },
            { value: "before", label: text("dateFilters.before") },
            { value: "between", label: text("dateFilters.between") },
          ],
        },
      ],
      ...pt?.operatorCommand,
    },
    calendar: { as: DateGrid, ...pt?.calendar },
    rangeCalendar: { as: DateRangeGrid, ...pt?.rangeCalendar },
  }),
  slots: {
    trigger: ({ settings }) => iconPart(settings.trigger, "calendar"),
    fieldLabel: ({ field }) => textSlot(field?.label ?? "dateFilters.field"),
    operatorLabel: ({ operator }) =>
      textSlot(operator ? `dateFilters.${operator}` : "dateFilters.operator"),
    valueLabel: ({ value }) =>
      value ? [createTextVNode(value)] : textSlot("dateFilters.value"),
    applyButton: ({ valid, apply }) => [
      h(
        "button",
        { type: "button", class: "f-button", disabled: !valid, onClick: apply },
        text("dateFilters.apply"),
      ),
    ],
  },
});
