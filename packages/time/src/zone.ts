import type { LocalDateTime, TimeZoneId, UTCDateTime } from "./jscalendar";

import { Temporal } from "temporal-polyfill";

/**
 * A local date-time in a zone. A value inside a zone's gap or overlap
 * reads with the offset before the transition, as JSCalendar defines it,
 * which is Temporal's `compatible`.
 */
export const zoned = (
  local: LocalDateTime,
  zone: TimeZoneId,
): Temporal.ZonedDateTime =>
  Temporal.PlainDateTime.from(local).toZonedDateTime(zone, {
    disambiguation: "compatible",
  });

/** A zoned date-time as a local date-time, to the second. */
export const local = (value: Temporal.ZonedDateTime): LocalDateTime =>
  value.toPlainDateTime().toString({ smallestUnit: "second" });

/** A zoned date-time as an instant, to the second. */
export const utc = (value: Temporal.ZonedDateTime): UTCDateTime =>
  value.toInstant().toString({ smallestUnit: "second" });

/** A local date-time in the one spelling the services compare by. */
export const normal = (value: LocalDateTime): LocalDateTime =>
  Temporal.PlainDateTime.from(value).toString({ smallestUnit: "second" });

/** A local date-time moved by the wall-clock distance between two others. */
export const shift = (
  value: LocalDateTime,
  from: LocalDateTime,
  to: LocalDateTime,
): LocalDateTime =>
  Temporal.PlainDateTime.from(value)
    .add(Temporal.PlainDateTime.from(from).until(to))
    .toString({ smallestUnit: "second" });

/** An instant in time, to the second, as `now` reads. */
export const stamp = (now: Date): UTCDateTime =>
  Temporal.Instant.fromEpochMilliseconds(now.getTime()).toString({
    smallestUnit: "second",
  });
