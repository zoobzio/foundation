// The vue date filters with the layer's Command behind its field and
// operator steps, the layer's Calendar and RangeCalendar behind its value
// step, the `calendar` icon as its trigger's content, and its text — the
// trigger, the fields' labels, the operators, the placeholders, the apply
// button — in the visitor's locale.
import Core from "@zoobzio/vue/components/date-filters.vue";

import { h } from "vue";
import { iconPart } from "./icon";
import { text, texts } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Calendar from "./calendar";
import Command from "./command";
import RangeCalendar from "./range-calendar";

export default wrap(Core, {
  props: (props) => ({ ...props, fields: texts(props.fields) }),
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
    calendar: { as: Calendar, ...pt?.calendar },
    rangeCalendar: { as: RangeCalendar, ...pt?.rangeCalendar },
  }),
  slots: {
    trigger: ({ settings }) => iconPart(settings.trigger, "calendar"),
    applyButton: ({ valid, apply }) => [
      h(
        "button",
        { type: "button", class: "f-button", disabled: !valid, onClick: apply },
        text("dateFilters.apply"),
      ),
    ],
  },
});
