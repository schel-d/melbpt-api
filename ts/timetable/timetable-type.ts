/**
 * Represents whether this timetable should be treated as a main timetable,
 * or a temporary one.
 */
export type TimetableType = typeof TimetableTypes[number]
/**
 * An array of all the possible timetable types.
 */
export const TimetableTypes = ["main", "temporary"] as const;
/**
 * Throws an error if the given string is not a {@link TimetableType}, otherwise
 * returns that string.
 * @param input The string representing the timetable type.
 */
export function parseTimetableType(input: string): TimetableType {
  if (TimetableTypes.includes(input as TimetableType)) {
    return input as TimetableType;
  }
  else {
    throw new Error(`Invalid TimetableType: "${input}"`);
  }
}
