/**
 * Represents a time of day as used by a timetable. Local times can also
 * represent times which occur on the next day for timetable purposes (i.e.
 * `minuteOfDay` can be greater than `60 * 24`), but only the next day. These
 * times are independent of a time zone.
 */
export class LocalTime {
  /**
   * The minute of the day, e.g. 74 for 1:14am. Can exceed `60 * 24` to
   * represent times during the following day (for timetable purposes), but
   * no more than one day.
   */
  readonly minuteOfDay: number;

  /**
   * Creates a {@link LocalTime} given a minute of day value.
   * @param minuteOfDay The minute of the day, e.g. 74 for 1:14am. Can exceed
   * `60 * 24` to represent times during the following day (for timetable
   * purposes), but no more than one day.
   */
  constructor(minuteOfDay: number) {
    if (isNaN(minuteOfDay) || minuteOfDay < 0 || minuteOfDay >= 60 * 24 * 2) {
      throw timeOutOfRange(minuteOfDay);
    }
    this.minuteOfDay = minuteOfDay;
  }
}

/**
 * Minute of day "`minuteOfDay`" is out of range for a LocalTime
 */
const timeOutOfRange = (minuteOfDay: number) => new Error(
  `Minute of day "${minuteOfDay}" is out of range for a LocalTime`
);
