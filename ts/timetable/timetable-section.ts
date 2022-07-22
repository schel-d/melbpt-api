import { DirectionID } from "../network/id";
import { TimetableEntry } from "./timetable-entry";
import { WeekDayRange } from "./week-day-range";

/**
 * Represents a group of entries in a timetable that run in a common direction
 * on the same days of the week.
 */
export class TimetableSection {
  /**
   * The direction every entry in this section runs in.
   */
  readonly direction: DirectionID;

  /**
   * The days of the week every entry in the section runs on.
   */
  readonly wdr: WeekDayRange;

  /**
   * The index that the first entry in this section will use. Entries are
   * indexed per timetable, not per section, so this section needs to know which
   * range of indices it's entries belong to.
   */
  readonly startIndex: number;

  /**
   * The timetable entries in this section.
   */
  readonly entries: TimetableEntry[];

  /**
   * Creates a new {@link TimetableSection}.
   * @param direction The direction every entry in this section runs in.
   * @param wdr The days of the week every entry in the section runs on.
   * @param startIndex The index that the first entry in this section will use.
   * Entries are indexed per timetable, not per section, so this section needs
   * to know which range of indices it's entries belong to.
   * @param entries The timetable entries in this section.
   */
  constructor(direction: DirectionID, wdr: WeekDayRange, startIndex: number,
    entries: TimetableEntry[]) {

    this.direction = direction;
    this.wdr = wdr;
    this.startIndex = startIndex;
    this.entries = entries;
  }
}
