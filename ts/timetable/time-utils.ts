/**
 * The official time zone name for Melbourne as used by Luxon.
 */
export const MelbTimeZone = "Australia/Melbourne";

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
}

/**
 * "`daysSinceMonday`" is not a valid days since Monday number for a day of
 * week.
 */
const invalidDaysSinceMonday = (daysSinceMonday: number) => new Error(
  `"${daysSinceMonday}" is not a valid days since Monday number for a day of ` +
  `week.`
)
