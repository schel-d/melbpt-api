import { DirectionID, LineID } from "../network/id";
import { Network } from "../network/network";
import { TimetableEntry } from "../timetable/timetable-entry";
import { TimetableSection } from "../timetable/timetable-section";
import { WeekDayRange } from "../timetable/week-day-range";
import { TtblSection } from "./read-ttbl";

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

  const entries: TimetableEntry[] = [];

  return new TimetableSection(directionID, wdr, startIndex, entries);
}

/**
 * The header of each section with timetable content must contain the direction
 * and week day range.
 */
const badHeader = () => new Error(
  "The header of each section with timetable content must contain the " +
  "direction and week day range"
);

/**
 * Cannot find line with ID "`lineID`".
 */
const badLine = (lineID: LineID) => new Error(
  `Cannot find line with ID "${lineID.toFixed()}"`
);

/**
 * Direction "`directionID`" is invalid for line id="`lineID`".
 */
const badDirection = (directionID: DirectionID, lineID: LineID) => new Error(
  `Direction "${directionID}" is invalid for line id="${lineID.toFixed()}"`
);
