/**
 * Represents a unique integer identifier for this stop. Tends to match the ID
 * used by the PTV API, but doesn't need to, so this cannot be expected to be
 * used for that purpose.
 */
export type StopID = number

/**
 * Represents a unique integet identifier for a platform. Only needs to be
 * unique for this stop. Usually matches the station signage naming, e.g. "1" or
 * "15a".
 */
export type PlatformID = string

/**
 * Represents a unique integer identifier for this line. Can be any number that
 * hasn't already been used (has no ties to the PTV API).
 */
export type LineID = number

/**
 * Represents a specific order of stops when used for a specific line. Each line
 * may run in multiple directions, e.g. towards the city, from the city, via the
 * city loop, on a particular branch, etc.
 */
export type DirectionID = string

/**
 * Represents a relative order of stops when used for a specific line. May
 * encompass multiple more specific directions. For example the directions a
 * city loop line runs in are `"up-direct"`, `"up-via-loop"`, `"down-direct"`,
 * and `"down-via-loop"`, but the *general* directions they run in are simply
 * `"up"` or `"down"`. Used in several cases where the specifics are irritating
 * or not necessary, such as platform rules, or the timetable editor.
 */
export type GeneralDirectionID = string
