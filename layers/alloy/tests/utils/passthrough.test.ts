import { describe, it, expect } from "vitest";
import { passthrough } from "../../app/utils/passthrough";

describe("passthrough", () => {
  it("returns localPT when userPT is undefined", () => {
    const local = { props: { value: "a" }, handlers: { click: () => {} } };
    const result = passthrough(undefined, local);
    expect(result.props).toEqual({ value: "a" });
    expect(result.handlers.click).toBe(local.handlers.click);
  });

  it("merges userPT props over localPT props", () => {
    const local = { props: { value: "a", size: "sm" }, handlers: {} };
    const user = { props: { value: "b" } };
    const result = passthrough(user, local);
    expect(result.props).toEqual({ value: "b", size: "sm" });
  });

  it("merges userPT handlers over localPT handlers", () => {
    const localClick = () => {};
    const userClick = () => {};
    const local = { props: {}, handlers: { click: localClick } };
    const user = { handlers: { click: userClick } };
    const result = passthrough(user, local);
    expect(result.handlers.click).toBe(userClick);
  });

  it("preserves localPT handlers not overridden by userPT", () => {
    const localClick = () => {};
    const local = { props: {}, handlers: { click: localClick } };
    const user = { props: { class: "custom" } };
    const result = passthrough(user, local);
    expect(result.handlers.click).toBe(localClick);
  });

  it("adds userPT props not present in localPT", () => {
    const local = { props: { value: "a" }, handlers: {} };
    const user = { props: { class: "custom", "data-test": "yes" } };
    const result = passthrough(user, local);
    expect(result.props).toEqual({ value: "a", class: "custom", "data-test": "yes" });
  });

  it("handles empty userPT", () => {
    const local = { props: { value: "a" }, handlers: {} };
    const result = passthrough({}, local);
    expect(result.props).toEqual({ value: "a" });
    expect(result.handlers).toEqual({});
  });
});
