import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountDateRangePicker } from "#test/support/fixtures/components";

const mockDate = { toString: () => "2026-04-25" };
const mockRange = { start: mockDate, end: mockDate };

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("DateRangePicker", () => {
  describe("static", () => {
    const wrapper = mountDateRangePicker({ modelValue: undefined });

    it("renders the root part with the two-month recipe", () => {
      const root = wrapper.findComponent({ name: "DateRangePickerRoot" });
      expect(root.exists()).toBe(true);
      expect(root.attributes("numberofmonths")).toBe("2");
    });

    it("renders an input per start/end segment through the iter recipe", () => {
      const inputs = wrapper.findAllComponents({ name: "DateRangePickerInput" });
      expect(inputs).toHaveLength(4);
      expect(inputs.map((i) => i.attributes("type"))).toEqual([
        "start",
        "start",
        "end",
        "end",
      ]);
    });

    it("renders the separator between the ranges", () => {
      expect(wrapper.find("em").text()).toBe("-");
    });

    it("renders the trigger with the calendar icon", () => {
      const trigger = wrapper.findComponent({ name: "DateRangePickerTrigger" });
      expect(trigger.find("i").attributes("alias")).toBe("calendar");
    });

    it("renders content with the side offset recipe", () => {
      const content = wrapper.findComponent({ name: "DateRangePickerContent" });
      expect(content.attributes("sideoffset")).toBe("8");
    });

    it("renders the calendar composition", () => {
      expect(wrapper.findComponent({ name: "DateRangePickerCalendar" }).exists()).toBe(true);
      expect(wrapper.findAllComponents({ name: "DateRangePickerCell" })).toHaveLength(1);
    });
  });

  describe("models", () => {
    it("binds controlled modelValue down", () => {
      const wrapper = mountDateRangePicker({ modelValue: mockRange });
      const root = wrapper.findComponent({ name: "DateRangePickerRoot" });
      expect(root.vm.$attrs.modelValue).toEqual(mockRange);
    });

    it("passes an explicit undefined through as a value (no fallback)", async () => {
      const wrapper = mountDateRangePicker({ modelValue: undefined });
      wrapper
        .findComponent({ name: "DateRangePickerRoot" })
        .vm.$emit("update:modelValue", mockRange);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[mockRange]]);
      const root = wrapper.findComponent({ name: "DateRangePickerRoot" });
      expect(root.vm.$attrs.modelValue).toBeUndefined();
    });

    it("re-emits open updates and tracks them (uncontrolled)", async () => {
      const wrapper = mountDateRangePicker({ modelValue: undefined });
      wrapper
        .findComponent({ name: "DateRangePickerRoot" })
        .vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "DateRangePickerRoot" });
      expect(root.vm.$attrs.open).toBe(true);
    });
  });

  describe("ctx", () => {
    it("exposes writable model refs", async () => {
      const wrapper = mountDateRangePicker({ modelValue: undefined });
      wrapper.vm.ctx.modelValue.value = mockRange;
      wrapper.vm.ctx.open.value = true;
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[mockRange]]);
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountDateRangePicker({ modelValue: undefined, pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "DateRangePickerRoot" }).classes()).toContain("custom");
    });

    it("a user iter callback replaces the local input recipe", () => {
      const wrapper = mountDateRangePicker({
        modelValue: undefined,
        pt: { input: ({ segment, type }) => ({ part: segment.part, type, asChild: true }) },
      });
      const inputs = wrapper.findAllComponents({ name: "DateRangePickerInput" });
      expect(inputs.every((i) => i.attributes("aschild") === "true")).toBe(true);
    });
  });

  describe("slots", () => {
    it("separator slot overrides the default", () => {
      const wrapper = mountDateRangePicker(
        { modelValue: undefined },
        { separator: "<span class=\"custom-sep\">to</span>" },
      );
      expect(wrapper.find("span.custom-sep").text()).toBe("to");
      expect(wrapper.find("em").exists()).toBe(false);
    });

    it("cell slot overrides the default cell part", () => {
      const wrapper = mountDateRangePicker(
        { modelValue: undefined },
        { cell: "<b class=\"custom-cell\">x</b>" },
      );
      expect(wrapper.find("b.custom-cell").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "DateRangePickerCell" }).exists()).toBe(false);
    });
  });
});
