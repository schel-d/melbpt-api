import { isDirectionUp } from "../network/direction";
import { DirectionID, LineID, StopID } from "../network/id";
import { Network } from "../network/network";

/**
 * The stop id for Pakenham, which is an exception to the usual set down only
 * rules.
 */
const pakenham = 214;

/**
 * The stop id for Sunbury, which is an exception to the usual set down only
 * rules.
 */
const sunbury = 262;

/**
 * Determines whether this stop on a particular service is set down only.
 * If a city-bound regional train stops at a stop that is also served by
 * suburban trains, then it is set down only, except for at Pakenham and
 * Sunbury. Throws an error if the line is not found.
 */
export function isSetDownOnly(network: Network, stop: StopID, line: LineID,
  direction: DirectionID) {

  const lineData = network.lines.get(line);
  if (lineData == null) { throw lineNotFound(line); }

  // "Set down only" only applies to regional trains.
  if (lineData.service != "regional") { return false; }

  // "Set down only" only applies to trains in the "up" direction.
  if (!isDirectionUp(direction)) { return false; }

  // Pakenham and Sunbury are exceptions to the rule. Suburban passengers are
  // permitted to board city-bound regional trains at these stops.
  if (stop == pakenham || stop == sunbury) { return false; }

  // If any city-bound regional trains stop at a stop that is also served by
  // suburban trains, then it is set down only.
  return network.lines.stopAt(stop).some(l => l.service == "suburban");
}

/**
 * Line id="`line`" not found.
 */
const lineNotFound = (line: number) => new Error(
  `Line id="${line}" not found.`
);
