// Gold standard: factories. `create*` splits the options once and returns the
// id-scoped composable; the tests assert that composition through the shim's
// Nuxt seams — the shared keyed container and the hook relay — not the
// service's own logic.
import type { CalendarOptions } from "../../../app/types/calendar";
import type { Doc } from "@zoobzio/calendar";

import { describe, expect, it, vi } from "vitest";
import { useNuxtApp } from "#app";
import { json } from "@zoobzio/calendar";
import { createCalendar } from "../../../app/factories/calendar";
import { NOW, fakeEntries } from "#test/data/calendar";

const makeOptions = (
  overrides: Partial<CalendarOptions<Doc, Doc>> = {},
): CalendarOptions<Doc, Doc> => ({
  ...json,
  fetch: vi.fn(async () => fakeEntries),
  now: () => NOW,
  initial: { date: "2026-03-04" },
  ...overrides,
});

describe("createCalendar", () => {
  it("returns a composable building a service over the shared store", () => {
    const team = createCalendar("team", makeOptions())();
    expect(team.id).toBe("team");
    expect(team.view).toBe("month");
    expect(team.date).toBe("2026-03-04");
    expect(team.entries).toEqual([]);
  });

  it("splits the config from the actions and the initial slice", () => {
    const team = createCalendar(
      "team",
      makeOptions({
        timeZone: "Europe/Amsterdam",
        views: ["week", "day"],
        initial: { view: "day", date: "2026-03-10" },
      }),
    )();
    expect(team.config).toEqual({
      timeZone: "Europe/Amsterdam",
      views: ["week", "day"],
    });
    expect(team.view).toBe("day");
    expect(team.date).toBe("2026-03-10");
  });

  it("fetches, reads and saves through the wired seams", async () => {
    const read = vi.fn(json.read);
    const save = vi.fn(async () => {});
    const options = makeOptions({ read, save });
    const team = createCalendar("team", options)();
    await team.init();
    expect(options.fetch).toHaveBeenCalledWith(team.range, team);
    expect(read).toHaveBeenCalledWith(fakeEntries, team.context);
    await team.remove("lunch");
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ scope: "all" }),
      team,
    );
  });

  it("relays service events onto the Nuxt hook bus", async () => {
    const hooks = {
      "calendar:navigated": vi.fn(),
      "calendar:loaded": vi.fn(),
      "calendar:changed": vi.fn(),
      "calendar:selected": vi.fn(),
    };
    useNuxtApp().hooks.addHooks(hooks);
    const team = createCalendar("team", makeOptions())();
    await team.init();
    expect(hooks["calendar:loaded"]).toHaveBeenCalledWith({
      id: "team",
      range: team.range,
      revision: 1,
    });
    team.select("lunch");
    expect(hooks["calendar:selected"]).toHaveBeenCalledWith({
      id: "team",
      key: "lunch",
    });
    await team.remove("lunch");
    expect(hooks["calendar:changed"]).toHaveBeenCalledTimes(1);
    team.show("week");
    expect(hooks["calendar:navigated"]).toHaveBeenCalledWith(
      expect.objectContaining({ id: "team", view: "week" }),
    );
  });

  it("logs each relayed event under the service's id", () => {
    const team = createCalendar("team", makeOptions())();
    team.select("lunch");
    expect(useNuxtApp().$logger("team").debug).toHaveBeenCalledWith(
      "Calendar selected",
      { id: "team", key: "lunch" },
    );
  });

  it("every call of one composable shares the id's container", async () => {
    const useTeam = createCalendar("team", makeOptions());
    const a = useTeam();
    const b = useTeam();
    expect(a).not.toBe(b);
    await a.init();
    expect(b.entries).toHaveLength(fakeEntries.length);
    expect(b.initialized).toBe(true);
  });

  it("different ids stay independent", async () => {
    const a = createCalendar("team", makeOptions())();
    const b = createCalendar("room", makeOptions())();
    await a.init();
    expect(b.entries).toEqual([]);
  });
});
