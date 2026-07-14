import { describe, it, expect } from "vitest";
import { Pagination } from "#foundation/utils/pagination";
const { paginate } = Pagination;

describe("paginate", () => {
  it("returns all pages when pageCount <= 7", () => {
    expect(paginate(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns all pages for exactly 7", () => {
    expect(paginate(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("shows ellipsis after 1 when page > 3", () => {
    const result = paginate(5, 20);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe("...");
  });

  it("shows ellipsis before last when page < pageCount - 2", () => {
    const result = paginate(5, 20);
    expect(result[result.length - 1]).toBe(20);
    expect(result[result.length - 2]).toBe("...");
  });

  it("shows window around current page", () => {
    const result = paginate(10, 20);
    expect(result).toEqual([1, "...", 9, 10, 11, "...", 20]);
  });

  it("omits leading ellipsis when page <= 3", () => {
    const result = paginate(2, 20);
    expect(result).toEqual([1, 2, 3, "...", 20]);
  });

  it("omits trailing ellipsis when page >= pageCount - 2", () => {
    const result = paginate(19, 20);
    expect(result).toEqual([1, "...", 18, 19, 20]);
  });

  it("handles page 1 of many", () => {
    const result = paginate(1, 20);
    expect(result).toEqual([1, 2, "...", 20]);
  });

  it("handles last page", () => {
    const result = paginate(20, 20);
    expect(result).toEqual([1, "...", 19, 20]);
  });

  it("returns single page", () => {
    expect(paginate(1, 1)).toEqual([1]);
  });
});
