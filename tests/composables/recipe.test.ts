import { describe, it, expect } from "vitest";
import { ref } from "vue";
import {
  useAccordion,
  useAutocomplete,
  useAvatar,
  useCalendar,
  useCheckbox,
  useCommand,
  useDateFilters,
  useDatePicker,
  useDateRangePicker,
  useDialog,
  useFab,
  useFacets,
  useHero,
  useKeywords,
  useListbox,
  useMenu,
  useMultiSelect,
  usePagination,
  usePopover,
  useRadio,
  useRangeCalendar,
  useScroller,
  useSegmentedControl,
  useSelect,
  useTabs,
  useTagsInput,
  useToast,
  useToaster,
  useTooltip,
  useMarkdown,
  useCodeView,
} from "#foundation/composables/recipe";

describe("useRecipe", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useDialog(
      { title: "Test", description: "Desc" },
      {},
    );
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.title).toBe("Test");
  });

  it("is reactive — updates when getter input changes", () => {
    const title = ref("First");
    const result = useDialog(
      () => ({ title: title.value, description: "Desc" }),
      {},
    );
    expect(result.value.props.title).toBe("First");
    title.value = "Second";
    expect(result.value.props.title).toBe("Second");
  });

  it("accepts ref inputs", () => {
    const props = ref({ items: [{ value: "a", label: "A" }] });
    const result = useAccordion(props, {});
    expect(result.value.props.items).toHaveLength(1);
  });

  it("includes handlers in the result", () => {
    const handler = () => {};
    const result = useDialog(
      { title: "T", description: "D" },
      { "update:open": handler },
    );
    expect(result.value.handlers["update:open"]).toBe(handler);
  });
});

describe("useAutocomplete", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useAutocomplete(
      { modelValue: "test", suggestions: [] },
      {},
    );
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.modelValue).toBe("test");
  });
});

describe("useAvatar", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useAvatar({ src: "https://example.com/img.png" }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.src).toBe("https://example.com/img.png");
  });
});

describe("useCalendar", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useCalendar({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useCheckbox", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useCheckbox({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useCommand", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useCommand({ groups: [] }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.groups).toEqual([]);
  });
});

describe("useDateFilters", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useDateFilters(
      { fields: [], addFilter: () => {}, removeFilter: () => {} },
      {},
    );
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.fields).toEqual([]);
  });
});

describe("useDatePicker", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useDatePicker({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useDateRangePicker", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useDateRangePicker({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useFab", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useFab({ label: "Add" }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.label).toBe("Add");
  });
});

describe("useFacets", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useFacets({ groups: [] }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.groups).toEqual([]);
  });
});

describe("useHero", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useHero({ tagline: "Hello World" }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.tagline).toBe("Hello World");
  });
});

describe("useKeywords", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useKeywords({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useListbox", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useListbox({ items: [{ value: "x", label: "X" }] }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.items).toHaveLength(1);
  });
});

describe("useMenu", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useMenu({ groups: [] }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.groups).toEqual([]);
  });
});

describe("useMultiSelect", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useMultiSelect({ items: [] }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.items).toEqual([]);
  });
});

describe("usePagination", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = usePagination(
      { page: 1, pageSize: 10, pageCount: 5, total: 50, goToPage: () => {} },
      {},
    );
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.page).toBe(1);
    expect(result.value.props.total).toBe(50);
  });
});

describe("usePopover", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = usePopover({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useRadio", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useRadio({ options: [{ value: "a", label: "A" }] }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.options).toHaveLength(1);
  });
});

describe("useRangeCalendar", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useRangeCalendar({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useScroller", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useScroller({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useSegmentedControl", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useSegmentedControl({ options: [{ value: "a", label: "A" }] }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.options).toHaveLength(1);
  });
});

describe("useSelect", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useSelect({ options: [{ value: "a", label: "A" }] }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.options).toHaveLength(1);
  });
});

describe("useTabs", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useTabs({ tabs: [{ value: "t1", label: "Tab 1" }] }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.tabs).toHaveLength(1);
  });
});

describe("useTagsInput", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useTagsInput({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useToast", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useToast({ title: "Done" }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.title).toBe("Done");
  });
});

describe("useToaster", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useToaster({}, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
  });
});

describe("useTooltip", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useTooltip({ content: "Hint" }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.content).toBe("Hint");
  });
});

describe("useMarkdown", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useMarkdown({ content: "# Hello" }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.content).toBe("# Hello");
  });
});

describe("useCodeView", () => {
  it("returns a computed Recipe with props and handlers", () => {
    const result = useCodeView({ content: "const x = 1;" }, {});
    expect(result.value).toHaveProperty("props");
    expect(result.value).toHaveProperty("handlers");
    expect(result.value.props.content).toBe("const x = 1;");
  });
});
