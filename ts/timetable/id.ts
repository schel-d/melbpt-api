/**
 * Represents a unique integer identifier for a timetable. This value needs to
 * be encodable to a 2-digit base-36 integer, so must be 0-1295 inclusive.
 * Further, the convention is to have the first base-36 digit match the line ID
 * if it were to be encoded to base-36.
 */
export type TimetableID = number;
