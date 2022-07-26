import { DateTime } from "luxon";

/**
 * The official time zone name for Melbourne as used by Luxon.
 */
export const melbTimeZone = "Australia/Melbourne";

/**
 * Represents a day of the week value, e.g. Thursday.
 */
export class DayOfWeek {
  /**
   * The number of days this day of the week is away from Monday, e.g. 3 for
   * Thursday. This value will be an integer between 0-6 inclusive.
   */
  readonly daysSinceMonday: number;

  /**
   * Creates a {@link DayOfWeek}.
   * @param daysSinceMonday The number of days this day of the week is away from
   * Monday, e.g. 3 for Thursday. This value must be an integer between 0-6
   * inclusive.
   */
  constructor(daysSinceMonday: number) {
    if (daysSinceMonday < 0 || daysSinceMonday >= 7 ||
      !Number.isInteger(daysSinceMonday)) {

      throw invalidDaysSinceMonday(daysSinceMonday);
    }

    this.daysSinceMonday = daysSinceMonday;
  }

  /**
   * Returns the name of the day of the week, e.g. "Thursday" for Thursday.
   */
  getName(): string {
    if (this.daysSinceMonday == 0) { return "Monday"; }
    if (this.daysSinceMonday == 1) { return "Tuesday"; }
    if (this.daysSinceMonday == 2) { return "Wednesday"; }
    if (this.daysSinceMonday == 3) { return "Thursday"; }
    if (this.daysSinceMonday == 4) { return "Friday"; }
    if (this.daysSinceMonday == 5) { return "Saturday"; }
    if (this.daysSinceMonday == 6) { return "Sunday"; }
    throw invalidDaysSinceMonday(this.daysSinceMonday);
  }

  /**
   * Returns the code name of the day of the week, e.g. "thu" for Thursday.
   */
  getCodeName(): string {
    if (this.daysSinceMonday == 0) { return "mon"; }
    if (this.daysSinceMonday == 1) { return "tue"; }
    if (this.daysSinceMonday == 2) { return "wed"; }
    if (this.daysSinceMonday == 3) { return "thu"; }
    if (this.daysSinceMonday == 4) { return "fri"; }
    if (this.daysSinceMonday == 5) { return "sat"; }
    if (this.daysSinceMonday == 6) { return "sun"; }
    throw invalidDaysSinceMonday(this.daysSinceMonday);
  }

  /**
   * Returns true if this day of week is either Saturday or Sunday.
   */
  isWeekend(): boolean {
    return this.daysSinceMonday == 5 || this.daysSinceMonday == 6;
  }

  /**
   * Returns true if this day of week is not Saturday or Sunday.
   */
  isWeekday(): boolean {
    return !this.isWeekend();
  }

  /**
   * Returns the day of week of the day before this one.
   */
  yesterday(): DayOfWeek {
    if (this.daysSinceMonday == 0) {
      return new DayOfWeek(6);
    }
    return new DayOfWeek(this.daysSinceMonday - 1);
  }

  /**
   * Returns the day of week of the day after this one.
   */
  tomorrow(): DayOfWeek {
    return new DayOfWeek((this.daysSinceMonday + 1) % 7)
  }

  /**
   * Creates a {@link DayOfWeek} from a luxon datetime.
   * @param value The date to determine the day of week from.
   */
  static fromLuxon(value: DateTime): DayOfWeek {
    return new DayOfWeek(value.weekday - 1);
  }
}

/**
 * "`daysSinceMonday`" is not a valid days since Monday number for a day of
 * week.
 */
const invalidDaysSinceMonday = (daysSinceMonday: number) => new Error(
  `"${daysSinceMonday}" is not a valid days since Monday number for a day of ` +
  `week.`
)
