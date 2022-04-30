import { StopID } from "./id";

export const FLINDERS_STREET_NAME = "Flinders Street";
const PARLIAMENT: StopID = 1155;
const MELBOURNE_CENTRAL: StopID = 1120;
const FLAGSTAFF: StopID = 1068;
const SOUTHERN_CROSS: StopID = 1181;
const FLINDERS_STREET: StopID = 1071;

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
 */
export function parseCityLoopPortal(input: string): CityLoopPortal {
  if (CityLoopPortals.includes(input as CityLoopPortal)) {
    return input as CityLoopPortal;
  }
  else { throw `Invalid CityLoopPortal: "${input}"`; }
}

/**
 * Returns the stops from the given city loop portal to Flinders Street Station,
 * directly (without going via the city loop). The list returned will NOT
 * include the portal station itself.
 * @param portal The city loop portal.
 */
export function stopsToFlindersDirect(portal: CityLoopPortal): StopID[] {
  if (portal === "richmond" || portal === "jolimont") {
    return [FLINDERS_STREET];
  }
  if (portal === "north-melbourne") {
    return [SOUTHERN_CROSS, FLINDERS_STREET];
  }
  throw `Invalid CityLoopPortal: "${portal}"`;
}

/**
 * Returns the stops from the given city loop portal to Flinders Street Station,
 * going via the city loop. The list returned will NOT include the portal
 * station itself.
 * @param portal The city loop portal.
 */
export function stopsToFlindersViaLoop(portal: CityLoopPortal): StopID[] {
  if (portal === "richmond" || portal === "jolimont") {
    return [PARLIAMENT, MELBOURNE_CENTRAL, FLAGSTAFF, SOUTHERN_CROSS, FLINDERS_STREET];
  }
  if (portal === "north-melbourne") {
    return [FLAGSTAFF, MELBOURNE_CENTRAL, PARLIAMENT, FLINDERS_STREET];
  }
  throw `Invalid CityLoopPortal: "${portal}"`;
}
