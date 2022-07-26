import { DateTime } from "luxon";
import { melbTimeZone } from "./time-utils";

/**
 * Represents a date which is independent of a time zone (simply stores numbers
 * for year, month, and day, as the Lord intended).
 */
export class LocalDate {
  /**
   * The year.
   */
  readonly year: number;

  /**
   * The month, e.g. 5 for May.
   */
  readonly month: number;

  /**
   * The day (of the month).
   */
  readonly day: number;

  /**
   * Creates a {@link LocalDate}. Throws an error if Luxon reckons it's not a
   * valid date.
   * @param year The year.
   * @param month The month, e.g. 5 for May.
   * @param day The day (of the month).
   */
  constructor(year: number, month: number, day: number) {
    // Use Luxon to validate the date components.
    if (!DateTime.utc(year, month, day).isValid) {
      throw invalidDate(year, month, day);
    }

    this.year = year;
    this.month = month;
    this.day = day;
  }

  /**
   * Creates a {@link LocalDate} from an ISO8601 string, e.g. "2022-07-21".
   * Throws an error if the string is invalid.
   * @param iso The ISO8601 string, e.g. "2022-07-21".
   */
  static fromISO(iso: string): LocalDate {
    // Ensure only date ISO strings are allowed, not ones with times attached
    // too.
    if (iso.length != 10) { throw invalidISODate(iso); }

    const luxonDT = DateTime.fromISO(iso, { zone: "utc" });
    if (!luxonDT.isValid) { throw invalidISODate(iso); }

    return new LocalDate(luxonDT.year, luxonDT.month, luxonDT.day);
  }

  /**
   * Creates a {@link LocalDate} from a Luxon {@link DateTime} object.
   * @param luxon The Luxon {@link DateTime} object.
   */
  static fromLuxon(luxon: DateTime): LocalDate {
    if (!luxon.isValid) {
      throw invalidDate(luxon.year, luxon.month, luxon.day);
    }
    return new LocalDate(luxon.year, luxon.month, luxon.day);
  }

  /**
   * Converts this date into a Luxon {@link DateTime} in the UTC timezone.
   */
  toUTCDateTime(): DateTime {
    return DateTime.utc(this.year, this.month, this.day);
  }

  /**
   * Converts this date into a Luxon {@link DateTime} in Melbourne's timezone.
   */
  toMelbDateTime(): DateTime {
    return DateTime.local(this.year, this.month, this.day, { zone: melbTimeZone });
  }

  /**
   * Converts this date into a ISO8601 string, e.g. "2022-07-21".
   */
  toISO(): string {
    return this.toUTCDateTime().toISODate();
  }

  /**
   * Returns true if this date occurs before the {@link other}.
   * @param other The date that if later, causes this method to return true.
   */
  isBefore(other: LocalDate) {
    if (this.year < other.year) { return true; }
    if (this.year > other.year) { return false; }
    if (this.month < other.month) { return true; }
    if (this.month > other.month) { return false; }
    return this.day < other.day;
  }

  /**
   * Returns true if this date occurs before the {@link other}, or is the same.
   * @param other The date that if later or the same, causes this method to
   * return true.
   */
  isBeforeOrEqual(other: LocalDate) {
    if (this.year < other.year) { return true; }
    if (this.year > other.year) { return false; }
    if (this.month < other.month) { return true; }
    if (this.month > other.month) { return false; }
    return this.day <= other.day;
  }

  /**
   * Returns true if this date occurs after the {@link other}.
   * @param other The date that if later, causes this method to return true.
   */
  isAfter(other: LocalDate) {
    return !this.isBeforeOrEqual(other);
  }

  /**
   * Returns true if this date occurs after the {@link other}, or is the same.
   * @param other The date that if later or the same, causes this method to
   * return true.
   */
  isAfterOrEqual(other: LocalDate) {
    return !this.isBefore(other);
  }

  /**
   * Returns the local date of the day before this day in the calendar. Uses
   * luxon under the hood to work out the date.
   */
  yesterday(): LocalDate {
    return LocalDate.fromLuxon(this.toUTCDateTime().minus({ days: 1 }));
  }

  /**
   * Returns the local date of the day after this day in the calendar. Uses
   * luxon under the hood to work out the date.
   */
  tomorrow(): LocalDate {
    return LocalDate.fromLuxon(this.toUTCDateTime().plus({ days: 1 }));
  }
}

/**
 * Function that detects whether a value is a LocalDate object or not.
 * @param value The potential LocalDate.
 */
export function isLocalDate(value: any): value is LocalDate {
  return value != null && value.toMelbDateTime != null;
}

/**
 * Minute of day "`minuteOfDay`" is out of range for a LocalTime.
 */
const invalidDate = (year: number, month: number, day: number) => new Error(
  `Date with year=${year}, month=${month}, and day=${day} is invalid.`
);

/**
 * "`iso`" is an invalid date string.
 */
const invalidISODate = (iso: string) => new Error(
  `"${iso}" is an invalid date string.`
);
