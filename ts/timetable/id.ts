/**
 * Represents a unique integer identifier for a timetable. This value needs to
 * be encodable to a 2-digit base-36 integer, so must be 0-1295 inclusive.
 * Further, the convention is to have the first base-36 digit match the line ID
 * if it were to be encoded to base-36.
 */
export type TimetableID = number;

/**
 * Represents a unique integer identifier for a particular service. "Service"
 * refers to pairing between a {@link TimetableEntry} and a specific calendar
 * day, i.e. the 4:17 Traralgon train from Southern Cross on the 22nd of July,
 * 2022.
 *
 * A service ID is typically encoded as a base-36 string, and thus its
 * components will be described as groups of base-36 characters. A service ID
 * contains:
 *
 * - Two base-36 digits for the timetable ID
 * - Three base-36 digits for the timetable entry index within that timetable
 * - One base-36 digit for the week number (service IDs are recycled every 36
 * weeks)
 *
 * So when the API is asked to retrieve service with id
 * `a20y57`, it looks for timetable with ID `a2` (decimal 362), entry with index
 * `0y5` (decimal 1229), and specificizes it (cuz that's a word) to the nearest
 * week (to the current date) designated as `7` (decimal 7).
 */
export type ServiceID = number;

/**
 * Parses a service ID from a base-36 encoded string, e.g. "a20y57". Returns
 * null if the service ID is invalid.
 * @param id The string to parse, e.g. "a20y57".
 */
export function safeParseServiceID(id: string): ServiceID | null {
  const isValid = /^[0-9a-z]{6}$/g.test(id);
  if (!isValid) { return null; }
  return parseInt(id, 36);
}

/**
 * Parses a service ID from a base-36 encoded string, e.g. "a20y57". Throws an
 * error if the service ID is invalid.
 * @param id The string to parse, e.g. "a20y57".
 */
export function parseServiceID(id: string): ServiceID {
  const result = safeParseServiceID(id);
  if (result == null) { throw invalidServiceID(id); }
  return result;
}

/**
 * Encodes a service ID to a base-36 string, e.g. "a20y57". Assumes the service
 * ID given is valid (does not range check).
 * @param id The service ID to encode.
 */
export function encodeServiceID(id: ServiceID): string {
  return id.toString(36).padStart(6, "0");
}

export type ServiceIDComponents = {
  timetable: TimetableID,
  index: number,
  week: number
}

/**
 * Divides a service ID into its timetable, index, and week number components.
 * Note that this function operates on numbers, not base-36 encoded strings.
 * @param id The service ID (a number, not a base-36 encoded string).
 */
export function getServiceIDComponents(id: ServiceID): ServiceIDComponents {
  const timetable = Math.floor(id / (36 * 36 * 36 * 36));
  const index = Math.floor(id / 36) % (36 * 36 * 36);
  const week = id % 36;
  return { timetable: timetable, index: index, week: week };
}

/**
 * "`id`" is not a valid service ID.
 */
const invalidServiceID = (id: string) => new Error(
  `"${id}" is not a valid service ID.`
);
