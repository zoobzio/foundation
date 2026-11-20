import type { TimelineGroup, TimelineItem } from "../types/components/timeline";
import type { RecordData, Service } from "@zoobzio/timeline";

import {
  TIMELINE_GROUP_FORMATS,
  TIMELINE_TIME_FORMATS,
} from "../constants/timeline";

/**
 * A group's span as a `Date` at the UTC midnight it starts on. A day, a
 * month, or a year has no zone, so it formats in UTC whatever zone the
 * timeline reads in.
 */
const at = (key: string): Date =>
  new Date(`${key}${"-01-01".slice(key.length - 4)}T00:00:00Z`);

/**
 * The groups of a service as rendered, in its locale: each under what its
 * span reads as, with its records as cards read them, their times in the
 * timeline's zone. A group with no span, the one of a timeline that
 * groups by nothing or of records with no time, has no label.
 */
export const timelineGroups = <T extends RecordData>(
  service: Service<T>,
): TimelineGroup<T>[] => {
  const { locale, timeZone } = service.context;
  const { grouping, today } = service;
  const heading =
    grouping === "none"
      ? undefined
      : new Intl.DateTimeFormat(locale, {
          ...TIMELINE_GROUP_FORMATS[grouping],
          timeZone: "UTC",
        });
  const time = new Intl.DateTimeFormat(locale, {
    ...TIMELINE_TIME_FORMATS[grouping],
    timeZone,
  });
  return service.groups.map((group) => {
    const items: TimelineItem<T>[] = group.records.map((record) => {
      const date = service.timeOf(record);
      return {
        key: service.keyOf(record),
        record,
        label: service.labelOf(record),
        time: date === null ? "" : time.format(date),
        datetime: date?.toISOString(),
      };
    });
    return {
      id: `${group.key}:${items[0]?.key ?? ""}`,
      key: group.key,
      label:
        heading === undefined || group.key === ""
          ? ""
          : heading.format(at(group.key)),
      today: group.key !== "" && today.startsWith(group.key),
      items,
    };
  });
};
