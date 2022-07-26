import { LineID } from "../network/id";
import { TimetableID } from "../timetable/id";
import { LocalDate } from "../timetable/local-date";
import { parseTimetableType, TimetableType, TimetableTypes } from "../timetable/timetable-type";
import { parseIntThrow } from "../utils";
import { TtblSection } from "./read-ttbl";

/**
 * Represents the information found in the .ttbl file's `[timetable]` section.
 */
export type TtblMetadata = {
  created: LocalDate,
  id: TimetableID,
  line: LineID,
  type: TimetableType,
  begins: LocalDate | null,
  ends: LocalDate | null
}

/**
 * Parses the information found in the .ttbl file's `[timetable]` section.
 * @param section The `[timetable]` section of the .ttbl file.
 */
export function readTtblMetadata(section: TtblSection): TtblMetadata {
  if (section.header != "timetable") {
    throw wrongSection(section.header);
  }

  const created = LocalDate.fromISO(getParam("created", section));
  const id = parseIntThrow(getParam("id", section));
  const line = parseIntThrow(getParam("line", section));
  const type = parseTimetableType(getParam("type", section));
  const begins = parseNullableDate(getParam("begins", section));
  const ends = parseNullableDate(getParam("ends", section));

  return {
    created: created, id: id, line: line, type: type, begins: begins, ends: ends
  };
}

/**
 * Retrieves a parameter's value by name from the content of the section. Throws
 * an error if the content has either 0, or more than one parameter matching
 * the given name.
 * @param paramName The name of the parameter.
 * @param section The section to extract the parameter's value from.
 */
function getParam(paramName: string, section: TtblSection): string {
  const params = section.content.filter(x => x.startsWith(`${paramName}: `));

  if (params.length == 0) { missingParam(paramName); }
  if (params.length > 1) { duplicateParam(paramName); }

  return params[0].substring(paramName.length + 2);
}

/**
 * Parses a LocalData, but allows `*` as a wildcard which returns null. All
 * other values are expected to be valid ISO8601 dates, and will throw an error
 * otherwise.
 * @param value A string with the ISO8601 date, or `*`.
 */
function parseNullableDate(value: string): LocalDate | null {
  if (value == "*") { return null; }
  return LocalDate.fromISO(value);
}

/**
 * Cannot read metadata from section with header "`header`".
 */
const wrongSection = (header: string) => new Error(
  `Cannot read metadata from section with header "${header}".`
);

/**
 * Timetable metadata missing "`param`" param.
 */
const missingParam = (param: string) => new Error(
  `Timetable metadata missing "${param}" param.`
);

/**
 * Timetable metadata has duplicated "`param`" param.
 */
const duplicateParam = (param: string) => new Error(
  `Timetable metadata has duplicated "${param}" param.`
);
