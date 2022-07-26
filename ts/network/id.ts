/**
 * Represents a unique integer identifier for a stop. Doesn't necessarily
 * match the PTV API, so it cannot be expected to be used for that purpose.
 */
export type StopID = number

/**
 * Represents a unique integet identifier for a platform. Only needs to be
 * unique for this stop. Usually matches the station signage naming, e.g. "1" or
 * "15a".
 */
export type PlatformID = string

/**
 * Represents a unique integer identifier for a line. Can be any number that
 * hasn't already been used (has no ties to the PTV API).
 */
export type LineID = number

/**
 * Represents a specific order of stops when used for a specific line. Each line
 * may run in multiple directions, e.g. towards the city, from the city, via the
 * city loop, on a particular branch, etc.
 */
export type DirectionID = string
