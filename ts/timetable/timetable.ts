import { DirectionID, LineID } from "../network/id"
import { TimetableID } from "./id";
import { LocalDate } from "./local-date";
import { TimetableEntry, TimetableEntryStop } from "./timetable-entry";
import { TimetableSection } from "./timetable-section";
import { TimetableType } from "./timetable-type";
import { WeekDayRange } from "./week-day-range";

export const maxTimetableID = 36 * 36;

/**
 * Represents a timetable on a particular line. It may be a main timetable, or
 * a temporary timetable with set start and end dates. The information stored in
 * this object is what is seen in each .ttbl file.
 */
export class Timetable {
  /**
   * The ID of this timetable. This value needs to be encodable to a 2-digit
   * base-36 integer, so must be 0-1295 inclusive. Further, the convention is to
   * have the first base-36 digit match the line ID if it were to be encoded to
   * base-36.
   */
  readonly id: TimetableID;

  /**
   * The line this timetable is for.
   */
  readonly line: LineID;

  /**
   * The date this timetable was originally created. Helps the program know how
   * recently timetables for each line have been updated.
   */
  readonly created: LocalDate;

  /**
   * The timetable type, either "main" or "temporary".
   */
  readonly type: TimetableType;

  /**
   * When this timetable comes into effect, whether this is a temporary or main
   * timetable. Leave null if it comes into effect immediately and retroactively
   * applies to every past calendar day too.
   */
  readonly begins: LocalDate | null;

  /**
   * When this timetable ends (and presumably another timetable comes into
   * effect), whether this is a temporary or main timetable. Leave null if its
   * end date is currently unknown, as will likely usually be the case for main
   * timetables.
   */
  readonly ends: LocalDate | null;

  /**
   * The sections of the timetable, containing the entries themselves. Entries
   * are grouped by direction and week day range.
   */
  readonly sections: TimetableSection[];

  /**
   * Creates a {@link Timetable}.
   * @param id The ID of this timetable. This value needs to be encodable to a
   * 2-digit base-36 integer, so must be 0-1295 inclusive. Further, the
   * convention is to have the first base-36 digit match the line ID if it were
   * to be encoded to base-36.
   * @param line The line this timetable is for.
   * @param created The date this timetable was originally created. Helps the
   * program know how recently timetables for each line have been updated.
   * @param type The timetable type, either "main" or "temporary".
   * @param begins When this timetable comes into effect, whether this is a
   * temporary or main timetable. Leave null if it comes into effect immediately
   * and retroactively applies to every past calendar day too.
   * @param ends When this timetable ends (and presumably another timetable
   * comes into effect), whether this is a temporary or main timetable. Leave
   * null if its end date is currently unknown, as will likely usually be the
   * case for main timetables.
   * @param sections The sections of the timetable, containing the entries
   * themselves. Entries are grouped by direction and week day range.
   */
  constructor(id: TimetableID, line: LineID, created: LocalDate,
    type: TimetableType, begins: LocalDate | null, ends: LocalDate | null,
    sections: TimetableSection[]) {

    if (id < 0 || id >= maxTimetableID) {
      throw invalidId(id);
    }

    this.id = id;
    this.line = line;
    this.created = created;
    this.type = type;
    this.begins = begins;
    this.ends = ends;

    this.sections = sections;
  }

  /**
   * Returns the timetable entry corresponding to the given index, or returns
   * null if that index isn't used within this timetable.
   * @param index The index to search for.
   */
  getEntryByIndex(index: number): FullTimetableEntry | null {
    const section = this.sections.find(s => s.hasIndex(index));
    if (section == null) { return null; }

    const result = section.getEntryByIndex(index);
    if (result == null) { return null; }

    return {
      timetable: this.id,
      line: this.line,
      direction: section.direction,
      dayOfWeek: result.dayOfWeek,
      index: result.entry.index,
      times: result.entry.times
    }
  }
}

/**
 * A {@link TimetableEntry} with details about the timetable it came from, line,
 * direction, and week day range attached.
 */
export type FullTimetableEntry = {
  timetable: TimetableID,
  line: LineID,
  direction: DirectionID;
  dayOfWeek: number;
  index: number,
  times: TimetableEntryStop[]
}

/**
 * Timetable ID must be 0-`(maxTimetableID - 1)` inclusive, so id=`id` is invalid.
 */
const invalidId = (id: number) => new Error(
  `Timetable ID must be 0-${(maxTimetableID - 1)} inclusive, so id=${id} is ` +
  `invalid.`
);
