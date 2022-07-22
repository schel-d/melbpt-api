import { TimetableID } from "./id";
import { FullTimetableEntry, Timetable } from "./timetable";

/**
 * An object to hold the entire collection of timetables.
 */
export class Timetables {
  /**
   * The array of timetables managed by this object.
   */
  readonly timetables: Timetable[];

  /**
   * Creates a {@link Timetables} object.
   * @param timetables The array of timetables managed by this object.
   */
  constructor(timetables: Timetable[]) {
    this.timetables = timetables;
  }

  /**
   * Returns the timetable entry corresponding to the given {@link index} within
   * the timetable with the matching {@link timetableID}, or returns null if an
   * entry matching those requirements can't be found. You can use
   * {@link getServiceIDComponents} to split a service ID into these components.
   *
   * @param timetableID The timetable ID of the timetable to search in.
   * @param index The index to search for.
   */
  getEntryByIndex(timetableID: TimetableID,
    index: number): FullTimetableEntry | null {

    const timetable = this.timetables.find(t => t.id == timetableID);
    if (timetable == null) { return null; }

    const entry = timetable.getEntryByIndex(index);
    return entry;
  }
}
