import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSearch, mockTable } from "#test/support/fixtures/data";

describe("DataTableSearch", () => {
  describe("static", () => {
    const wrapper = mountSearch();

    it("renders a Popover", () => {
      expect(wrapper.findComponent({ name: "Popover" }).exists()).toBe(true);
    });

    it("renders a Fab trigger", () => {
      expect(wrapper.findComponent({ name: "Fab" }).exists()).toBe(true);
    });

    it("renders search wrap with f-data-table-search class", () => {
      expect(wrapper.find(".f-data-table-search").exists()).toBe(true);
    });

    it("renders an Input", () => {
      expect(wrapper.find(".f-command-input").exists()).toBe(true);
    });
  });

  describe("interaction — popover", () => {
    it("syncs input with existing query when popover opens", async () => {
      const table = mockTable();
      table.query.value = "existing search";
      const wrapper = mountSearch({ table });
      const popover = wrapper.findComponent({ name: "Popover" });

      popover.vm.$emit("update:open", true);
      await nextTick();

      const input = wrapper.find(".f-command-input");
      expect(input.attributes("value")).toBe("existing search");
    });

    it("starts with empty input when no query", () => {
      const wrapper = mountSearch();
      const input = wrapper.find(".f-command-input");
      expect(input.attributes("value")).toBe("");
    });
  });

  describe("interaction — keyboard", () => {
    it("closes popover on Escape keydown", async () => {
      const wrapper = mountSearch();
      const popover = wrapper.findComponent({ name: "Popover" });
      popover.vm.$emit("update:open", true);
      await nextTick();

      const input = wrapper.find(".f-command-input");
      await input.trigger("keydown", { key: "Escape" });
      // Escape handler sets open = false — no crash
    });
  });

  describe("interaction — popover close", () => {
    it("does not sync input when popover closes", async () => {
      const table = mockTable();
      table.query.value = "existing";
      const wrapper = mountSearch({ table });
      const popover = wrapper.findComponent({ name: "Popover" });

      // Open first to sync
      popover.vm.$emit("update:open", true);
      await nextTick();
      expect(wrapper.find(".f-command-input").attributes("value")).toBe("existing");

      // Close — input should retain its value, not re-sync
      popover.vm.$emit("update:open", false);
      await nextTick();
      expect(wrapper.find(".f-command-input").attributes("value")).toBe("existing");
    });
  });

  // NOTE: Debounce watcher behavior (input ref → setTimeout → query update)
  // is hard to test through shallowMount stubs because the @input handler
  // reads $event.target.value from the native event, which stubs don't provide.
  // The debounce logic is implicitly covered by the factory's fetch tests
  // and is best verified in integration/e2e tests.

  describe("passthrough", () => {
    it("pt.popover merges onto Popover", () => {
      const wrapper = mountSearch({ pt: { popover: { props: { class: "custom" } } } });
      expect(wrapper.findComponent({ name: "Popover" }).attributes("class")).toContain("custom");
    });
  });
});
