import { DayOfWeek } from "./time-utils";

/**
 * Represents which days of the week a timetable entry runs on.
 */
export class WeekDayRange {
  /**
   * Whether or not Monday is included in the week day range.
   */
  readonly mon: boolean;

  /**
   * Whether or not Tuesday is included in the week day range.
   */
  readonly tue: boolean;

  /**
   * Whether or not Wednesday is included in the week day range.
   */
  readonly wed: boolean;

  /**
   * Whether or not Thursday is included in the week day range.
   */
  readonly thu: boolean;

  /**
   * Whether or not Friday is included in the week day range.
   */
  readonly fri: boolean;

  /**
   * Whether or not Saturday is included in the week day range.
   */
  readonly sat: boolean;

  /**
   * Whether or not Sunday is included in the week day range.
   */
  readonly sun: boolean;

  /**
   * Creates a {@link WeekDayRange}.
   * @param mon Whether or not Monday is included in the week day range.
   * @param tue Whether or not Tuesday is included in the week day range.
   * @param wed Whether or not Wednesday is included in the week day range.
   * @param thu Whether or not Thursday is included in the week day range.
   * @param fri Whether or not Friday is included in the week day range.
   * @param sat Whether or not Saturday is included in the week day range.
   * @param sun Whether or not Sunday is included in the week day range.
   */
  constructor(mon: boolean, tue: boolean, wed: boolean, thu: boolean,
    fri: boolean, sat: boolean, sun: boolean) {

    this.mon = mon;
    this.tue = tue;
    this.wed = wed;
    this.thu = thu;
    this.fri = fri;
    this.sat = sat;
    this.sun = sun;
  }

  /**
   * Parse a week day range from a string, e.g. "MTWT___".
   * @param value The string, e.g. "MTWT___".
   */
  static parse(value: string): WeekDayRange {
    if (value.length != 7) { throw invalidWDR(value); }

    const isLetterOrUnderscore = (char: string, allowedLetter: string) => {
      if (char == allowedLetter) { return true; }
      if (char == "_") { return false; }
      throw invalidWDR(value);
    };

    return new WeekDayRange(
      isLetterOrUnderscore(value[0], "M"),
      isLetterOrUnderscore(value[1], "T"),
      isLetterOrUnderscore(value[2], "W"),
      isLetterOrUnderscore(value[3], "T"),
      isLetterOrUnderscore(value[4], "F"),
      isLetterOrUnderscore(value[5], "S"),
      isLetterOrUnderscore(value[6], "S")
    );
  }

  /**
   * Converts this week day range into a string, e.g. "MTWT___".
   */
  toString(): string {
    return (this.mon ? "M" : "_") +
      (this.tue ? "T" : "_") +
      (this.wed ? "W" : "_") +
      (this.thu ? "T" : "_") +
      (this.fri ? "F" : "_") +
      (this.sat ? "S" : "_") +
      (this.sun ? "S" : "_");
  }

  /**
   * Counts how many days are in this week day range.
   */
  numOfDays(): number {
    let count = 0;
    if (this.mon) { count++; }
    if (this.tue) { count++; }
    if (this.wed) { count++; }
    if (this.thu) { count++; }
    if (this.fri) { count++; }
    if (this.sat) { count++; }
    if (this.sun) { count++; }
    return count;
  }

  /**
   * Get day of week number (where 0 means Monday and 6 means Sunday), based on
   * an index. This is useful for week day ranges that span multiple days. For
   * example if the week day range is __WT_S_, index 0 returns 2 (for
   * Wednesday), index 1 returns 3 (for Thursday), and index 2 returns 5 (for
   * Saturday). Throws an error if the index is out of range.
   */
  getDayOfWeekByIndex(index: number): DayOfWeek {
    const days = [];
    if (this.mon) { days.push(0); }
    if (this.tue) { days.push(1); }
    if (this.wed) { days.push(2); }
    if (this.thu) { days.push(3); }
    if (this.fri) { days.push(4); }
    if (this.sat) { days.push(5); }
    if (this.sun) { days.push(6); }
    if (index < 0 || index >= days.length) { throw invalidDayOfWeekIndex(index); }
    return new DayOfWeek(days[index]);
  }
}

/**
 * "`value`" is not a valid week day range.
 */
const invalidWDR = (value: string) => new Error(
  `"${value}" is not a valid week day range.`
);

/**
 * "`value`" is not a valid week day range.
 */
const invalidDayOfWeekIndex = (value: number) => new Error(
  `"${value}" is not a valid day of week index for this week day range.`
);
