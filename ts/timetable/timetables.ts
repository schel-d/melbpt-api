import { Timetable } from "./timetable";

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
}
