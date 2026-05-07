import { describe, it, expect, beforeEach } from "vitest";

beforeEach(() => {
  useAuth().user.value = null;
});

describe("hasRole", () => {
  it("returns false when no user", () => {
    expect(hasRole("admin")).toBe(false);
  });

  it("returns false when user has no roles", () => {
    useAuth().user.value = { id: "1" };
    expect(hasRole("admin")).toBe(false);
  });

  it("returns true when user has the role", () => {
    useAuth().user.value = { id: "1", roles: ["admin", "editor"] };
    expect(hasRole("admin")).toBe(true);
  });

  it("returns false when user lacks the role", () => {
    useAuth().user.value = { id: "1", roles: ["viewer"] };
    expect(hasRole("admin")).toBe(false);
  });

  it("checks multiple roles (all required)", () => {
    useAuth().user.value = { id: "1", roles: ["admin", "editor"] };
    expect(hasRole("admin", "editor")).toBe(true);
    expect(hasRole("admin", "viewer")).toBe(false);
  });
});

describe("hasScope", () => {
  it("returns false when no user", () => {
    expect(hasScope("users:read")).toBe(false);
  });

  it("returns false when user has no scopes", () => {
    useAuth().user.value = { id: "1" };
    expect(hasScope("users:read")).toBe(false);
  });

  it("returns true when user has the scope", () => {
    useAuth().user.value = { id: "1", scopes: ["users:read", "users:write"] };
    expect(hasScope("users:read")).toBe(true);
  });

  it("returns false when user lacks the scope", () => {
    useAuth().user.value = { id: "1", scopes: ["users:read"] };
    expect(hasScope("billing:manage")).toBe(false);
  });

  it("checks multiple scopes (all required)", () => {
    useAuth().user.value = { id: "1", scopes: ["users:read", "users:write"] };
    expect(hasScope("users:read", "users:write")).toBe(true);
    expect(hasScope("users:read", "billing:manage")).toBe(false);
  });
});
