// The vue form field with the layer's inputs behind its parts, and the
// field's text in the visitor's locale: its label and hint through their
// slots, its placeholder — an attribute of the input — through the field,
// and its options through the Select, MultiSelect and Radio of the layer.
import Core from "@zoobzio/vue/components/form-field.vue";

import { text, textSlot } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";
import DatePicker from "./date-picker";
import FileInput from "./file-input";
import MultiSelect from "./multi-select";
import RichText from "./rich-text";
import Select from "./select";
import TagsInput from "./tags-input";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    field:
      "placeholder" in props.field && props.field.placeholder !== undefined
        ? { ...props.field, placeholder: text(props.field.placeholder) }
        : props.field,
  }),
  pt: {
    select: { as: Select },
    multiSelect: { as: MultiSelect },
    checkbox: { as: Checkbox },
    datePicker: { as: DatePicker },
    tagsInput: { as: TagsInput },
    fileInput: { as: FileInput },
    richText: { as: RichText },
  },
  slots: {
    labelText: ({ field }) => textSlot(field.label),
    hintText: ({ field }) => (field.hint ? textSlot(field.hint) : []),
  },
});
