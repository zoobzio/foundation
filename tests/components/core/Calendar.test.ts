import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountCalendar } from "#test/support/fixtures/components";

const mockDate = { toString: () => "2026-04-25" };

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("Calendar", () => {
  describe("static", () => {
    const wrapper = mountCalendar({ modelValue: undefined });

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "CalendarRoot" }).exists()).toBe(true);
    });

    it("renders the header composition", () => {
      expect(wrapper.findComponent({ name: "CalendarHeader" }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: "CalendarHeading" }).exists()).toBe(true);
    });

    it("renders prev/next with their icons", () => {
      const prev = wrapper.findComponent({ name: "CalendarPrev" });
      const next = wrapper.findComponent({ name: "CalendarNext" });
      expect(prev.find("i").attributes("alias")).toBe("chevron-left");
      expect(next.find("i").attributes("alias")).toBe("chevron-right");
    });

    it("renders a grid per month in the render-scope payload", () => {
      expect(wrapper.findAllComponents({ name: "CalendarGrid" })).toHaveLength(1);
    });

    it("renders a head cell per weekday", () => {
      const headCells = wrapper.findAllComponents({ name: "CalendarHeadCell" });
      expect(headCells).toHaveLength(7);
      expect(headCells[0]?.text()).toBe("Su");
    });

    it("renders a cell and trigger per date through the iter recipes", () => {
      const cells = wrapper.findAllComponents({ name: "CalendarCell" });
      const triggers = wrapper.findAllComponents({ name: "CalendarCellTrigger" });
      expect(cells).toHaveLength(7);
      expect(triggers).toHaveLength(7);
      expect(cells[0]?.attributes("date")).toBe("2026-04-25");
      expect(triggers[0]?.attributes("day")).toBe("2026-04-25");
      expect(triggers[0]?.attributes("month")).toBe("2026-04-25");
    });
  });

  describe("models", () => {
    it("binds controlled modelValue down", () => {
      const wrapper = mountCalendar({ modelValue: mockDate });
      const root = wrapper.findComponent({ name: "CalendarRoot" });
      expect(root.attributes("modelvalue")).toBe("2026-04-25");
    });

    it("re-emits child updates", async () => {
      const wrapper = mountCalendar({ modelValue: undefined });
      wrapper
        .findComponent({ name: "CalendarRoot" })
        .vm.$emit("update:modelValue", mockDate);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[mockDate]]);
    });

    it("passes an explicit undefined through as a value (no fallback)", async () => {
      const wrapper = mountCalendar({ modelValue: undefined });
      wrapper
        .findComponent({ name: "CalendarRoot" })
        .vm.$emit("update:modelValue", mockDate);
      await nextTick();
      const root = wrapper.findComponent({ name: "CalendarRoot" });
      expect(root.attributes("modelvalue")).toBeUndefined();
    });

    it("stays pinned to the modelValue prop while provided", async () => {
      const wrapper = mountCalendar({ modelValue: mockDate });
      wrapper
        .findComponent({ name: "CalendarRoot" })
        .vm.$emit("update:modelValue", { toString: () => "2026-05-01" });
      await nextTick();
      const root = wrapper.findComponent({ name: "CalendarRoot" });
      expect(root.attributes("modelvalue")).toBe("2026-04-25");
    });
  });

  describe("ctx", () => {
    it("exposes a writable model ref", async () => {
      const wrapper = mountCalendar({ modelValue: undefined });
      wrapper.vm.ctx.modelValue.value = mockDate;
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[mockDate]]);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountCalendar({ modelValue: undefined, pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "CalendarRoot" }).classes()).toContain("custom");
    });

    it("a user iter callback replaces the local cell recipe", () => {
      const wrapper = mountCalendar({
        modelValue: undefined,
        pt: { cell: (date) => ({ date, asChild: true }) },
      });
      const cells = wrapper.findAllComponents({ name: "CalendarCell" });
      expect(cells.every((c) => c.attributes("aschild") === "true")).toBe(true);
    });
  });

  describe("slots", () => {
    it("heading slot overrides the default", () => {
      const wrapper = mountCalendar(
        { modelValue: undefined },
        { heading: "<em class=\"custom-heading\">April</em>" },
      );
      expect(wrapper.find("em.custom-heading").text()).toBe("April");
      expect(wrapper.findComponent({ name: "CalendarHeading" }).exists()).toBe(false);
    });

    it("cell slot overrides the default cell part", () => {
      const wrapper = mountCalendar(
        { modelValue: undefined },
        { cell: "<template #cell=\"{ date }\"><b class=\"custom-cell\">{{ date.toString() }}</b></template>" },
      );
      expect(wrapper.findAll("b.custom-cell")).toHaveLength(7);
      expect(wrapper.findComponent({ name: "CalendarCell" }).exists()).toBe(false);
    });
  });
});
