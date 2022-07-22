import { DirectionID } from "../network/id";
import { TimetableEntry, TimetableEntryStop } from "./timetable-entry";
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

    if (entries.some((e, i) => e.index != i + startIndex)) {
      throw indexMismatch();
    }

    this.direction = direction;
    this.wdr = wdr;
    this.startIndex = startIndex;
    this.entries = entries;
  }

  /**
   * Returns true if the entry with the given index is found in this timetable.
   * @param index The index to search for.
   */
  hasIndex(index: number): boolean {
    // Entries have multiple indices, one for each day of the week they occur
    // on.
    const numOfEntries = this.entries.length * this.wdr.numOfDays();

    const finalIndex = this.startIndex + numOfEntries - 1;
    return index >= this.startIndex && index <= finalIndex;
  }

  /**
   * Returns the timetable entry corresponding to the given index, or returns
   * null if that index isn't within this section.
   * @param index The index to search for.
   */
  getEntryByIndex(index: number): TimetableEntryAndDayOfWeek | null {
    // Entries have multiple indices, one for each day of the week they occur
    // on, so we must calculate which day of week this index is for.
    if (!this.hasIndex(index)) { return null; }

    const localIndex = index - this.startIndex;
    const dayOfWeekIndex = Math.floor(localIndex / this.entries.length);
    const dayOfWeek = this.wdr.getDayOfWeekByIndex(dayOfWeekIndex);

    const entry = this.entries[localIndex % this.entries.length];
    return { entry: entry, dayOfWeek: dayOfWeek };
  }
}

type TimetableEntryAndDayOfWeek = {
  entry: TimetableEntry,
  dayOfWeek: number
}

/**
 * Some entries in this timetable section were given incorrect indices, or this
 * section's starting index was incorrect.
 */
const indexMismatch = () => new Error(
  "Some entries in this timetable section were given incorrect indices, or " +
  "this section's starting index was incorrect."
)
