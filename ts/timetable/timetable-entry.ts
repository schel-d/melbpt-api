import { StopID } from "../network/id";
import { LocalTime } from "./local-time";

export const maxEntriesPerTimetable = 36 * 36 * 36;

/**
 * Represents a repeating service in a particular timetable section.
 */
export class TimetableEntry {
  /**
   * The index of the entry in the timetable, which combined with the timetable
   * ID can uniquely identify this entry.
   */
  readonly index: number;

  /**
   * A list of stops and the times they are stopped at. Order is likely to be in
   * direction order, but not guaranteed.
   */
  readonly times: StopList;

  constructor(index: number, times: StopList) {
    if (index < 0 || index >= maxEntriesPerTimetable) {
      throw invalidIndex(index);
    }
    if (times.length < 2) {
      throw notEnoughStops(index);
    }

    this.index = index;
    this.times = times;
  }
}

/**
 * Represents a list of stops and the times they are stopped at. Order is likely
 * to be in direction order, but not guaranteed.
 */
export type StopList = {
  readonly stop: StopID,
  readonly time: LocalTime
}[];


/**
 * Attempted to create timetable entry with less than 2 stops (index=`index`).
 */
const notEnoughStops = (index: number) => new Error(
  `Attempted to create timetable entry with less than 2 stops (index=${index}).`
);

/**
 * Timetable entry index must be 0-`(maxEntriesPerTimetable - 1)` inclusive, so
 * index=`index` is invalid.
 */
const invalidIndex = (index: number) => new Error(
  `Timetable entry index must be 0-${(maxEntriesPerTimetable - 1)} ` +
  `inclusive, so index=${index} is invalid.`
);
