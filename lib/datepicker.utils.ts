import { DateTime } from 'luxon';

/**
 * Helpers that keep the datepicker components anchored to a single time zone.
 *
 * DayPicker and date-fns both work in the browser's local zone: the day the calendar highlights,
 * the string in the time input and the button label are all local wall clock. Left alone that means
 * a viewer outside EST edits - and saves - a different wall clock than the one the app stores its
 * due dates in.
 *
 * The fix is to hand those local-only APIs a Date whose *local* wall clock has been shifted to read
 * as the target zone's wall clock, then convert back to a real instant on the way out. Everything
 * the user sees and picks is therefore the target zone's wall clock, and what gets saved is the
 * instant that wall clock names in that zone.
 */

/** A Date whose browser-local wall clock reads as `instant`'s wall clock in its own zone. Display only - never save this. */
export function toZonedWallClock(instant: DateTime): Date {
  return new Date(instant.year, instant.month - 1, instant.day, instant.hour, instant.minute, instant.second, instant.millisecond);
}

/** Reads a wall-clock Date produced by {@link toZonedWallClock} back as a real instant in `zone`. */
export function fromZonedWallClock(wallClock: Date, zone: string): DateTime {
  return DateTime.fromObject(
    {
      year: wallClock.getFullYear(),
      month: wallClock.getMonth() + 1,
      day: wallClock.getDate(),
      hour: wallClock.getHours(),
      minute: wallClock.getMinutes(),
      second: wallClock.getSeconds(),
      millisecond: wallClock.getMilliseconds(),
    },
    { zone },
  );
}

/**
 * Reads a react-hook-form field value as an instant in `zone`. An absent or unparseable value falls
 * back to now, which is what the pickers previously did for an empty field - and avoids handing an
 * Invalid Date to date-fns `format`, which throws.
 */
export function parseFieldValueInZone(fieldValue: unknown, zone: string, useEpochTimestamp: boolean): DateTime {
  if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
    return DateTime.now().setZone(zone);
  }

  const parsed =
    useEpochTimestamp ?
      DateTime.fromMillis(Number.parseInt(String(fieldValue)), { zone })
    : DateTime.fromJSDate(new Date(fieldValue as string | number | Date), { zone });

  return parsed.isValid ? parsed : DateTime.now().setZone(zone);
}
