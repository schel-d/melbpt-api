import { StopID } from "./id";

/**
 * Represents the last stop on the line before entering the city loop in an "up"
 * direction.
 */
export type CityLoopPortal = typeof CityLoopPortals[number]
/**
 * An array of all the possible city loop portals.
 */
export const CityLoopPortals = ["richmond", "jolimont", "north-melbourne"] as const;
/**
 * Throws an error if the given string is not a {@link CityLoopPortal},
 * otherwise returns that string.
 * @param input The string representing the city loop portal.
 * @returns The same string as the {@link CityLoopPortal} type.
 */
export function parseCityLoopPortal(input: string): CityLoopPortal {
  if (CityLoopPortals.includes(input as CityLoopPortal)) {
    return input as CityLoopPortal;
  }
  else { throw `Invalid CityLoopPortal: "${input}"`; }
}

/**
 * Represents a direction a train could travel around the city loop. Not to be
 * confused with the possible direction IDs that a city loop line route would
 * use.
 */
export type CityLoopDirection = typeof CityLoopDirections[number]
/**
 * An array of all the possible city loop directions.
 */
export const CityLoopDirections = ["clockwise", "anticlockwise"] as const;
/**
 * Throws an error if the given string is not a {@link CityLoopDirection},
 * otherwise returns that string.
 * @param input The string representing the city loop direction.
 * @returns The same string as the {@link CityLoopDirection} type.
 */
export function parseCityLoopDirection(input: string): CityLoopDirection {
  if (CityLoopDirections.includes(input as CityLoopDirection)) {
    return input as CityLoopDirection;
  }
  else { throw `Invalid CityLoopDirection: "${input}"`; }
}

const PARLIAMENT: StopID = 1155;
const MELBOURNE_CENTRAL: StopID = 1120;
const FLAGSTAFF: StopID = 1068;
const SOUTHERN_CROSS: StopID = 1181;
const FLINDERS_STREET: StopID = 1071;
const RICHMOND: StopID = 1162;
const JOLIMONT: StopID = 1104;
const NORTH_MELBOURNE: StopID = 1144;
