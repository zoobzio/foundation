// The vue date filters with the `calendar` icon as the content of its
// trigger, the layer's Command behind its field and operator steps, and
// the layer's Calendar and RangeCalendar behind its date steps.
import Core from "@zoobzio/vue/components/date-filters.vue";

import { iconPart } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Calendar from "./calendar";
import Command from "./command";
import RangeCalendar from "./range-calendar";

export default wrap(Core, {
  pt: {
    fieldCommand: { as: Command },
    operatorCommand: { as: Command },
    calendar: { as: Calendar },
    rangeCalendar: { as: RangeCalendar },
  },
  slots: {
    trigger: ({ settings }) => iconPart(settings.trigger, "calendar"),
  },
});
