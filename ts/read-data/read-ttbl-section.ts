import { Direction } from "../network/direction";
import { DirectionID, LineID, StopID } from "../network/id";
import { Network } from "../network/network";
import { LocalTime } from "../timetable/local-time";
import { StopList, TimetableEntry } from "../timetable/timetable-entry";
import { TimetableSection } from "../timetable/timetable-section";
import { WeekDayRange } from "../timetable/week-day-range";
import { parseIntThrow } from "../utils";
import { TtblSection } from "./read-ttbl";

/**
 * Represents a row in the timetable content in this section.
 */
type TtblRow = {
  stop: StopID,
  times: (LocalTime | null)[]
}

/**
 * Parses the given {@link TtblSection} into a {@link TimetableSection} object.
 * @param section The section to parse.
 * @param lineID The line this timetable section occurs on.
 * @param startIndex The starting index to continue indexing services from
 * (since indexing is common across this entire timetable file).
 * @param network The network object containing information about this line.
 */
export function readTtblSection(section: TtblSection, lineID: LineID,
  startIndex: number, network: Network): TimetableSection {

  const line = network.lines.get(lineID);
  if (line == null) { throw badLine(lineID); }

  const headerComponents = section.header.split(", ");
  if (headerComponents.length != 2) { throw badHeader(); }

  const directionID = headerComponents[0];
  const direction = line.directions.find(d => d.id == directionID);
  if (direction == null) { throw badDirection(directionID, lineID); }

  const wdr = WeekDayRange.parse(headerComponents[1]);

  const entries = getEntries(section, lineID, direction, startIndex);

  return new TimetableSection(directionID, wdr, startIndex, entries);
}

/**
 * Extract the timetable entries themselves from the content of the given
 * {@link TtblSection}.
 * @param section The section to parse.
 * @param lineID The line this timetable section occurs on.
 * @param direction The direction information related to this section.
 * @param startIndex The starting index to continue indexing services from
 * (since indexing is common across this entire timetable file).
 */
function getEntries(section: TtblSection, lineID: LineID, direction: Direction,
  startIndex: number): TimetableEntry[] {

  const grid = gridify(section.content);

  // Check that the stops match the exact order they are in the direction data.
  const stops = grid.map(r => r.stop);
  if (direction.stops.some((x, index) => stops[index] != x)) {
    throw badStops(direction.id, lineID);
  }

  const entries: TimetableEntry[] = [];

  const numOfServices = grid[0].times.length;
  for (let i = 0; i < numOfServices; i++) {
    const index = startIndex + i;
    const column = grid.map(r => {
      return { stop: r.stop, time: r.times[i] };
    });

    // Auto-conversion to StopList doesn't work here because the array
    // created above may have nulls in the time property, but after the filter
    // here that can no longer be the case, so it's fine to convert to a
    // StopList now.
    const times = column.filter(r => r.time != null) as StopList;

    entries.push(new TimetableEntry(index, times));
  }


  return entries;
}

/**
 * Turns the 1-dimensional array of lines into a 2-dimensional array of times
 * with associated stop IDs.
 * @param content The timetable content.
 */
function gridify(content: string[]): TtblRow[] {
  // Check the section isn't empty.
  if (content.length == 0) { throw gridMissing(); }

  // Convert the array to be 2-dimensional.
  const grid = content.map(line => {
    // Split each line by the space character, trim whitespace around each cell,
    // and remove any empty strings from the resulting array.
    const cells = line.split(" ").map(c => c.trim()).filter(c => c.length != 0);
    return cells;
  });

  // Parse the times and extract the stop IDs.
  const result = grid.map(row => {
    const stopID = parseIntThrow(row[0]);

    const times = row.slice(2).map(t => {
      if (t == "-") {
        return null;
      }

      const nextDay = t.startsWith(">");
      const timeString = t.replace(/^>/g, "");
      return LocalTime.parse(timeString, nextDay);
    });

    return { stop: stopID, times: times };
  });

  // Make sure the 2D grid is rectangular (not jagged).
  if (result.some(r => r.times.length != result[0].times.length)) {
    throw gridNonRectangular();
  }

  return result;
}

/**
 * The header of each section with timetable content must contain the direction
 * and week day range.
 */
const badHeader = () => new Error(
  "The header of each section with timetable content must contain the " +
  "direction and week day range."
);

/**
 * Cannot find line with ID "`lineID`".
 */
const badLine = (lineID: LineID) => new Error(
  `Cannot find line with ID "${lineID.toFixed()}".`
);

/**
 * Direction "`directionID`" is invalid for line id="`lineID`".
 */
const badDirection = (directionID: DirectionID, lineID: LineID) => new Error(
  `Direction "${directionID}" is invalid for line id="${lineID.toFixed()}".`
);

/**
 * Timetable had incorrect stops for direction "`directionID`" on line
 * id="`lineID`".
 */
const badStops = (directionID: DirectionID, lineID: LineID) => new Error(
  `Timetable had incorrect stops for direction "${directionID}" on line ` +
  `id="${lineID.toFixed()}".`
);

/**
 * Not all rows in this timetable grid had consistant lengths (i.e. the grid was
 * not rectangular).
 */
const gridNonRectangular = () => new Error(
  "Not all rows in this timetable grid had consistant lengths (i.e. the grid " +
  "was not rectangular)."
);

/**
 * The timetable grid was missing.
 */
const gridMissing = () => new Error(
  "The timetable grid was missing."
);
