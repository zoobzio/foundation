// The vue form field with the layer's wrapped controls behind its parts, so
// a field's select, multi select, checkbox, date picker, tags input, file
// input, and rich text draw their icons.
import Core from "@zoobzio/vue/components/form-field.vue";

import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";
import DatePicker from "./date-picker";
import FileInput from "./file-input";
import MultiSelect from "./multi-select";
import RichText from "./rich-text";
import Select from "./select";
import TagsInput from "./tags-input";

export default wrap(Core, {
  pt: {
    select: { as: Select },
    multiSelect: { as: MultiSelect },
    checkbox: { as: Checkbox },
    datePicker: { as: DatePicker },
    tagsInput: { as: TagsInput },
    fileInput: { as: FileInput },
    richText: { as: RichText },
  },
});
