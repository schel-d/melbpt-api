import { DateTime } from "luxon";
import { MelbTimeZone } from "./time-utils";

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
   * Converts this date into a Luxon {@link DateTime} in the UTC timezone.
   */
  toUTCDateTime(): DateTime {
    return DateTime.utc(this.year, this.month, this.day);
  }

  /**
   * Converts this date into a Luxon {@link DateTime} in Melbourne's timezone.
   */
  toMelbDateTime(): DateTime {
    return DateTime.local(this.year, this.month, this.day, { zone: MelbTimeZone });
  }

  /**
   * Converts this date into a ISO8601 string, e.g. "2022-07-21".
   */
  toISO(): string {
    return this.toUTCDateTime().toISODate();
  }
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
