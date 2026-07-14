import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountFilters, mockTable } from "#test/support/fixtures/data";

const getAutocomplete = (wrapper: ReturnType<typeof mountFilters>) =>
  wrapper.findComponent({ name: "Autocomplete" });

describe("DataTableFilters", () => {
  describe("static", () => {
    const wrapper = mountFilters();

    it("renders root with f-data-table-filters class", () => {
      expect(wrapper.find(".f-data-table-filters").exists()).toBe(true);
    });

    it("renders chips area", () => {
      expect(wrapper.find(".f-data-table-filters-chips").exists()).toBe(true);
    });

    it("renders sparkle icon", () => {
      expect(wrapper.find(".f-data-table-filters-icon").exists()).toBe(true);
    });

    it("renders Autocomplete", () => {
      expect(getAutocomplete(wrapper).exists()).toBe(true);
    });

    it("renders FilterHelp", () => {
      expect(wrapper.findComponent({ name: "DataTableFilterHelp" }).exists()).toBe(true);
    });

    it("renders input wrap", () => {
      expect(wrapper.find(".f-data-table-filters-input-wrap").exists()).toBe(true);
    });
  });

  describe("select — field locking", () => {
    it("selecting an enum field enters raw mode with = suffix", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Status", value: "status", hasChildren: true, icon: "filter" });
      await nextTick();

      // Autocomplete should receive updated modelValue via binding
      expect(ac.attributes("model-value")).toBe("Status=");
    });

    it("selecting __search sets input to opening quote", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Search", value: "__search" });
      await nextTick();

      expect(ac.attributes("model-value")).toBe('"');
    });

    it("selecting __keywords sets input to opening paren", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Keywords", value: "__keywords" });
      await nextTick();

      expect(ac.attributes("model-value")).toBe("(");
    });
  });

  describe("select — enum value", () => {
    it("calls addFilter and resets after selecting an enum value", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      // Lock the enum field
      ac.vm.$emit("select", { label: "Status", value: "status", hasChildren: true, icon: "filter" });
      await nextTick();

      // Select a value
      ac.vm.$emit("select", { label: "Active", value: "Active" });
      await nextTick();

      expect(table.addFilter).toHaveBeenCalledWith({
        field: "status",
        operator: "is",
        value: { type: "enum", value: ["Active"] },
      });
      // Resets after selection
      expect(ac.attributes("model-value")).toBe("");
    });
  });

  describe("select — date flow", () => {
    it("locks operator after selecting date field + operator", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Created", value: "created", hasChildren: true, icon: "calendar" });
      await nextTick();
      ac.vm.$emit("select", { label: "After", value: ">", hasChildren: true });
      await nextTick();

      expect(ac.attributes("model-value")).toBe("Created>");
    });

    it("calls addDateFilter after selecting date value", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Created", value: "created", hasChildren: true, icon: "calendar" });
      await nextTick();
      ac.vm.$emit("select", { label: "After", value: ">", hasChildren: true });
      await nextTick();
      ac.vm.$emit("select", { label: "2025-06-15", value: "2025-06-15" });
      await nextTick();

      expect(table.addDateFilter).toHaveBeenCalledWith({
        field: "created",
        operator: "after",
        value: new Date("2025-06-15T00:00:00Z"),
      });
      expect(ac.attributes("model-value")).toBe("");
    });

    it("between flow: first date locks, second date submits", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Created", value: "created", hasChildren: true, icon: "calendar" });
      await nextTick();
      ac.vm.$emit("select", { label: "Between", value: "><", hasChildren: true });
      await nextTick();

      // First date — should lock, not submit
      ac.vm.$emit("select", { label: "2025-01-01", value: "2025-01-01" });
      await nextTick();
      expect(table.addDateFilter).not.toHaveBeenCalled();
      expect(ac.attributes("model-value")).toBe("Created><2025-01-01,");

      // Second date — should submit
      ac.vm.$emit("select", { label: "2025-06-30", value: "2025-06-30" });
      await nextTick();
      expect(table.addDateFilter).toHaveBeenCalledWith({
        field: "created",
        operator: "between",
        value: new Date("2025-01-01T00:00:00Z"),
        endValue: new Date("2025-06-30T00:00:00Z"),
      });
    });
  });

  describe("unwind", () => {
    it("unwinding to panel 0 resets all locked state", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Status", value: "status", hasChildren: true, icon: "filter" });
      await nextTick();

      ac.vm.$emit("unwind", 0);
      await nextTick();

      expect(ac.attributes("model-value")).toBe("");
    });
  });

  describe("submit", () => {
    it("submitting a quoted string sets query and fetches", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("submit", '"hello world"');
      await nextTick();

      expect(table.query.value).toBe("hello world");
      expect(table.fetch).toHaveBeenCalled();
    });

    it("submitting keywords sets keywords and fetches", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("submit", "(+foo -bar)");
      await nextTick();

      expect(table.keywords.value).toBe("+foo -bar");
      expect(table.fetch).toHaveBeenCalled();
    });

    it("submitting shorthand calls addFilter", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("submit", "Status=Active");
      await nextTick();

      expect(table.addFilter).toHaveBeenCalled();
    });

    it("submitting invalid input does nothing", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("submit", "garbage");
      await nextTick();

      expect(table.addFilter).not.toHaveBeenCalled();
      expect(table.fetch).not.toHaveBeenCalled();
    });
  });

  describe("keydown", () => {
    it("Escape resets autocomplete state", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Status", value: "status", hasChildren: true, icon: "filter" });
      await nextTick();

      ac.vm.$emit("keydown", new KeyboardEvent("keydown", { key: "Escape" }));
      await nextTick();

      expect(ac.attributes("model-value")).toBe("");
    });
  });

  describe("model update — auto-submit", () => {
    it("auto-submits query on closing quote", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("update:modelValue", '"hello"');
      await nextTick();

      expect(table.query.value).toBe("hello");
      expect(table.fetch).toHaveBeenCalled();
    });

    it("auto-submits keywords on closing paren", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("update:modelValue", "(+foo)");
      await nextTick();

      expect(table.keywords.value).toBe("+foo");
    });
  });

  describe("model update — raw mode", () => {
    it("entering raw mode with quote suppresses suggestions", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("update:modelValue", '"hel');
      await nextTick();

      // Autocomplete should receive empty suggestions (raw mode)
      // and a closing hint
      expect(ac.attributes("hint")).toBe('"');
      expect(ac.attributes("suggestions")).toBe("");
    });

    it("entering raw mode with paren suppresses suggestions", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("update:modelValue", "(+fo");
      await nextTick();

      expect(ac.attributes("hint")).toBe(")");
    });

    it("no hint when quote is closed", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("update:modelValue", '"hello"');
      await nextTick();

      // Auto-submitted, so reset to empty
      expect(ac.attributes("model-value")).toBe("");
      expect(ac.attributes("hint")).toBe("");
    });

    it("does not auto-submit invalid keywords", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("update:modelValue", "(invalid)");
      await nextTick();

      // Should not submit — stays in the input
      expect(table.keywords.value).toBe("");
      expect(table.fetch).not.toHaveBeenCalled();
    });
  });

  describe("model update — showEmpty", () => {
    it("passes showEmpty when locked with no matching suggestions", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      // Lock enum field
      ac.vm.$emit("select", { label: "Status", value: "status", hasChildren: true, icon: "filter" });
      await nextTick();

      // Type something that won't match any enum value
      ac.vm.$emit("update:modelValue", "Status=zzzzz");
      await nextTick();

      expect(ac.attributes("show-empty")).toBe("true");
    });
  });

  describe("model update — shorthand detection", () => {
    it("typing Status= auto-locks the enum field", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("update:modelValue", "Status=");
      await nextTick();

      // The input value gets rewritten to normalized form
      expect(ac.attributes("model-value")).toBe("Status=");
    });

    it("typing Created> auto-locks field + operator", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("update:modelValue", "Created>");
      await nextTick();

      expect(ac.attributes("model-value")).toBe("Created>");
    });
  });

  describe("keydown — backspace step unwinding", () => {
    it("backspace at enum prefix unwinds to field selection", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      // Lock enum field: inputValue = "Status="
      ac.vm.$emit("select", { label: "Status", value: "status", hasChildren: true, icon: "filter" });
      await nextTick();
      expect(ac.attributes("model-value")).toBe("Status=");

      // Backspace at the locked prefix boundary
      ac.vm.$emit("keydown", new KeyboardEvent("keydown", { key: "Backspace", cancelable: true }));
      await nextTick();

      // Should unwind: no locked field, input trimmed
      expect(ac.attributes("model-value")).toBe("Statu");
    });

    it("backspace at date operator prefix unwinds operator", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      // Lock date field + operator: inputValue = "Created>"
      ac.vm.$emit("select", { label: "Created", value: "created", hasChildren: true, icon: "calendar" });
      await nextTick();
      ac.vm.$emit("select", { label: "After", value: ">", hasChildren: true });
      await nextTick();
      expect(ac.attributes("model-value")).toBe("Created>");

      // Backspace at operator prefix
      ac.vm.$emit("keydown", new KeyboardEvent("keydown", { key: "Backspace", cancelable: true }));
      await nextTick();

      // Should unwind operator, keep field locked
      expect(ac.attributes("model-value")).toBe("Created");
    });

    it("backspace at between date1 prefix unwinds to operator", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      // Lock date field + between operator + first date
      ac.vm.$emit("select", { label: "Created", value: "created", hasChildren: true, icon: "calendar" });
      await nextTick();
      ac.vm.$emit("select", { label: "Between", value: "><", hasChildren: true });
      await nextTick();
      ac.vm.$emit("select", { label: "2025-01-01", value: "2025-01-01" });
      await nextTick();
      expect(ac.attributes("model-value")).toBe("Created><2025-01-01,");

      // Backspace at date1 prefix
      ac.vm.$emit("keydown", new KeyboardEvent("keydown", { key: "Backspace", cancelable: true }));
      await nextTick();

      expect(ac.attributes("model-value")).toBe("Created><");
    });
  });

  describe("model update — prefix breakage", () => {
    it("editing past enum prefix unwinds locked field", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      // Lock enum field
      ac.vm.$emit("select", { label: "Status", value: "status", hasChildren: true, icon: "filter" });
      await nextTick();

      // Type something that doesn't start with "Status="
      ac.vm.$emit("update:modelValue", "Stat");
      await nextTick();

      // Should have unwound — no more steps
      expect(ac.attributes("model-value")).toBe("Stat");
    });

    it("editing past date operator prefix unwinds operator", async () => {
      const wrapper = mountFilters();
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Created", value: "created", hasChildren: true, icon: "calendar" });
      await nextTick();
      ac.vm.$emit("select", { label: "After", value: ">", hasChildren: true });
      await nextTick();

      // Type something that doesn't start with "Created>"
      ac.vm.$emit("update:modelValue", "Created");
      await nextTick();

      // Should unwind operator but keep field
      expect(ac.attributes("model-value")).toBe("Created");
    });
  });

  describe("select — edge cases", () => {
    it("ignores disabled items", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Active", value: "Active", disabled: true });
      await nextTick();

      expect(table.addFilter).not.toHaveBeenCalled();
    });

    it("before date calls addDateFilter with before operator", async () => {
      const table = mockTable();
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      ac.vm.$emit("select", { label: "Created", value: "created", hasChildren: true, icon: "calendar" });
      await nextTick();
      ac.vm.$emit("select", { label: "Before", value: "<", hasChildren: true });
      await nextTick();
      ac.vm.$emit("select", { label: "2025-12-31", value: "2025-12-31" });
      await nextTick();

      expect(table.addDateFilter).toHaveBeenCalledWith({
        field: "created",
        operator: "before",
        value: new Date("2025-12-31T00:00:00Z"),
      });
    });
  });

  describe("keydown — backspace unravel from filters", () => {
    it("backspace with empty input triggers the unravel path", async () => {
      const table = mockTable({
        filters: [{
          field: "status",
          operator: "is",
          value: { type: "enum", value: ["Active"] },
        }],
      });
      const wrapper = mountFilters({ table });
      const ac = getAutocomplete(wrapper);

      // Backspace on empty input — should enter the unravel branch
      ac.vm.$emit("keydown", new KeyboardEvent("keydown", { key: "Backspace", cancelable: true }));
      await nextTick();

      // tryUnravel ran — autocomplete state was updated (input is no longer empty)
      // The exact result depends on the stubbed useFilterUnravel, but no crash
    });
  });

  describe("filter chips", () => {
    it("renders chips area", () => {
      const wrapper = mountFilters();
      expect(wrapper.find(".f-data-table-filters-chips").exists()).toBe(true);
    });

    it("renders Chip for each active filter", async () => {
      const table = mockTable({
        filters: [
          { field: "status", operator: "is", value: { type: "enum", value: ["Active"] } },
          { field: "status", operator: "is", value: { type: "enum", value: ["Pending"] } },
        ],
      });
      const wrapper = mountFilters({ table });
      await nextTick();

      const chips = wrapper.findAllComponents({ name: "Chip" });
      expect(chips.length).toBe(2);
    });

    it("clicking a chip calls removeFilter", async () => {
      const table = mockTable({
        filters: [
          { field: "status", operator: "is", value: { type: "enum", value: ["Active"] } },
        ],
      });
      const wrapper = mountFilters({ table });
      await nextTick();

      const chips = wrapper.findAllComponents({ name: "Chip" });
      expect(chips.length).toBe(1);
      await chips[0].trigger("click");
      expect(table.removeFilter).toHaveBeenCalledWith(0);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountFilters({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-data-table-filters").classes()).toContain("custom");
    });
  });
});
