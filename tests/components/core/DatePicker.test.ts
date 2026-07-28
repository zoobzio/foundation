import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountDatePicker } from "#test/support/fixtures/components";

const mockDate = { toString: () => "2026-04-25" };

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("DatePicker", () => {
  describe("static", () => {
    const wrapper = mountDatePicker({ modelValue: undefined });

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "DatePickerRoot" }).exists()).toBe(true);
    });

    it("renders an input per segment through the iter recipe", () => {
      const inputs = wrapper.findAllComponents({ name: "DatePickerInput" });
      expect(inputs).toHaveLength(2);
      expect(inputs.map((i) => i.attributes("part"))).toEqual(["literal", "day"]);
      expect(inputs.map((i) => i.text())).toEqual(["/", "25"]);
    });

    it("renders the trigger with the calendar icon", () => {
      const trigger = wrapper.findComponent({ name: "DatePickerTrigger" });
      expect(trigger.find("i").attributes("alias")).toBe("calendar");
    });

    it("renders content with the side offset recipe", () => {
      const content = wrapper.findComponent({ name: "DatePickerContent" });
      expect(content.attributes("sideoffset")).toBe("8");
    });

    it("renders the calendar composition", () => {
      expect(wrapper.findComponent({ name: "DatePickerCalendar" }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: "DatePickerHeading" }).exists()).toBe(true);
      expect(wrapper.findAllComponents({ name: "DatePickerHeadCell" })).toHaveLength(1);
      expect(wrapper.findAllComponents({ name: "DatePickerCell" })).toHaveLength(1);
    });
  });

  describe("models", () => {
    it("binds controlled modelValue down", () => {
      const wrapper = mountDatePicker({ modelValue: mockDate });
      const root = wrapper.findComponent({ name: "DatePickerRoot" });
      expect(root.attributes("modelvalue")).toBe("2026-04-25");
    });

    it("passes an explicit undefined through as a value (no fallback)", async () => {
      const wrapper = mountDatePicker({ modelValue: undefined });
      wrapper
        .findComponent({ name: "DatePickerRoot" })
        .vm.$emit("update:modelValue", mockDate);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[mockDate]]);
      const root = wrapper.findComponent({ name: "DatePickerRoot" });
      expect(root.attributes("modelvalue")).toBeUndefined();
    });

    it("re-emits open updates and tracks them (uncontrolled)", async () => {
      const wrapper = mountDatePicker({ modelValue: undefined });
      wrapper
        .findComponent({ name: "DatePickerRoot" })
        .vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "DatePickerRoot" });
      expect(root.vm.$attrs.open).toBe(true);
    });
  });

  describe("ctx", () => {
    it("exposes writable model refs", async () => {
      const wrapper = mountDatePicker({ modelValue: undefined });
      wrapper.vm.ctx.modelValue.value = mockDate;
      wrapper.vm.ctx.open.value = true;
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[mockDate]]);
      expect(wrapper.emitted("update:open")).toEqual([[true]]);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountDatePicker({ modelValue: undefined, pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "DatePickerRoot" }).classes()).toContain("custom");
    });

    it("a user iter callback replaces the local input recipe", () => {
      const wrapper = mountDatePicker({
        modelValue: undefined,
        pt: { input: (segment) => ({ part: segment.part, asChild: true }) },
      });
      const inputs = wrapper.findAllComponents({ name: "DatePickerInput" });
      expect(inputs.every((i) => i.attributes("aschild") === "true")).toBe(true);
    });
  });

  describe("slots", () => {
    it("trigger slot overrides the default", () => {
      const wrapper = mountDatePicker(
        { modelValue: undefined },
        { trigger: "<button class=\"custom-trigger\"></button>" },
      );
      expect(wrapper.find("button.custom-trigger").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "DatePickerTrigger" }).exists()).toBe(false);
    });

    it("cell slot overrides the default cell part", () => {
      const wrapper = mountDatePicker(
        { modelValue: undefined },
        { cell: "<b class=\"custom-cell\">x</b>" },
      );
      expect(wrapper.find("b.custom-cell").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "DatePickerCell" }).exists()).toBe(false);
    });
  });
});
