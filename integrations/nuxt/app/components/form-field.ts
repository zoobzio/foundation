// The vue form field with the layer's inputs behind its parts, and the
// field's text — its label, hint, placeholder, options — resolved.
import Core from "@zoobzio/vue/components/form-field.vue";

import { texts } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";
import DatePicker from "./date-picker";
import FileInput from "./file-input";
import MultiSelect from "./multi-select";
import RichText from "./rich-text";
import Select from "./select";
import TagsInput from "./tags-input";

export default wrap(Core, {
  props: (props) => ({ ...props, field: texts(props.field) }),
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
