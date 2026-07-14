import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";

import type { Root } from "hast";
import { codeToHast } from "shiki";
import { toHtml } from "hast-util-to-html";
import { useHighlight } from "#foundation/composables/highlight";

// Mock shiki before importing the composable
vi.mock("shiki", () => ({
  codeToHast: vi.fn(),
}));

vi.mock("hast-util-to-html", () => ({
  toHtml: vi.fn(),
}));

vi.mock("../../app/utils/shiki-theme", () => ({ default: {} }));

const mockCodeToHast = vi.mocked(codeToHast);
const mockToHtml = vi.mocked(toHtml);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useHighlight", () => {
  it("returns empty string when code is empty", async () => {
    const result = useHighlight(ref(""), ref("json"));
    await nextTick();
    expect(result.value).toBe("");
    expect(mockCodeToHast).not.toHaveBeenCalled();
  });

  it("returns empty string when lang is empty", async () => {
    const result = useHighlight(ref("const x = 1"), ref(""));
    await nextTick();
    expect(result.value).toBe("");
    expect(mockCodeToHast).not.toHaveBeenCalled();
  });

  it("returns empty string when tree has no pre element", async () => {
    mockCodeToHast.mockResolvedValue({
      type: "root",
      children: [{ type: "text", value: "no pre here" }],
    } satisfies Root);

    const result = useHighlight(ref("code"), ref("json"));
    await nextTick();
    await nextTick();
    expect(result.value).toBe("");
  });

  it("returns empty string when pre has no code child", async () => {
    mockCodeToHast.mockResolvedValue({
      type: "root",
      children: [{
        type: "element",
        tagName: "pre",
        children: [{ type: "text", value: "no code element" }],
        properties: {},
      }],
    } satisfies Root);

    const result = useHighlight(ref("code"), ref("json"));
    await nextTick();
    await nextTick();
    expect(result.value).toBe("");
  });

  it("returns highlighted HTML on valid tree", async () => {
    const codeChildren = [{ type: "text", value: "highlighted" }];
    mockCodeToHast.mockResolvedValue({
      type: "root",
      children: [{
        type: "element",
        tagName: "pre",
        properties: {},
        children: [{
          type: "element",
          tagName: "code",
          properties: {},
          children: codeChildren,
        }],
      }],
    } satisfies Root);
    mockToHtml.mockReturnValue("<span>highlighted</span>");

    const result = useHighlight(ref("const x = 1"), ref("javascript"));
    await nextTick();
    await nextTick();

    expect(mockCodeToHast).toHaveBeenCalledWith("const x = 1", expect.objectContaining({ lang: "javascript" }));
    expect(mockToHtml).toHaveBeenCalledWith(codeChildren);
    expect(result.value).toBe("<span>highlighted</span>");
  });

  it("re-runs when code changes", async () => {
    const codeChildren = [{ type: "text", value: "x" }];
    mockCodeToHast.mockResolvedValue({
      type: "root",
      children: [{
        type: "element",
        tagName: "pre",
        properties: {},
        children: [{
          type: "element",
          tagName: "code",
          properties: {},
          children: codeChildren,
        }],
      }],
    } satisfies Root);
    mockToHtml.mockReturnValue("<span>v1</span>");

    const code = ref("v1");
    const result = useHighlight(code, ref("json"));
    await nextTick();
    await nextTick();
    expect(result.value).toBe("<span>v1</span>");

    mockToHtml.mockReturnValue("<span>v2</span>");
    code.value = "v2";
    await nextTick();
    await nextTick();
    expect(mockCodeToHast).toHaveBeenCalledTimes(2);
  });
});
