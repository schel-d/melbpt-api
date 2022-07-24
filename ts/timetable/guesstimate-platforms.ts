import { DateTime } from "luxon";
import { directionIsDown, directionIsUp } from "../network/direction";
import { DirectionID, LineID, PlatformID, StopID } from "../network/id";
import { Line } from "../network/line";
import { Network } from "../network/network";
import { DayOfWeek } from "./time-utils";

/**
 * Possible clauses:
 * none
 * up/down/[specific-direction]
 * red/yellow/green/etc.
 * suburban/regional
 * line-X, where X is a LineID
 * stops-at-X, where X is a StopID
 * originates-at-X, where X is a StopID
 * terminates-at-X, where X is a StopID
 * weekday/weekend
 *
 * ! can be used to negate any clause
 *
 * Line name (e.g. "pakenham") is deprecated and replaced by "line-X" where X
 * is a LineID.
 */

/**
 * The information about the service used to determine its platform.
 */
export type PlatformClues = {
  line: LineID,
  direction: DirectionID,
  stoppingPattern: StopID[],
  timetabledDayOfWeek: DayOfWeek,
  timeUTC: DateTime
}

/**
 * Guesstimate which platform a service will used, based on the stop's platform
 * rules and some basic information about the service.
 * @param network The network object to retrieve stops/lines information from.
 * @param stop The stop that has the platform's we're guessing between.
 * @param clues Details about the service that might hint towards its platform.
 */
export function guesstimatePlatforms(network: Network, stop: StopID,
  clues: PlatformClues): PlatformID | null {

  const stopData = network.stops.get(stop);
  const lineData = network.lines.get(clues.line);
  if (stopData == null || lineData == null) {
    throw dataMissing(stop, clues.line);
  }

  // Only one platform? Don't bother then...
  if (stopData.platforms.length == 1) { return stopData.platforms[0].id; }

  const matches = stopData.platforms.filter(platform => {

    // An empty set of platform rules allows any service to match.
    if (platform.rules.length == 0) { return true; }

    // If one rule in the array matches, then this platform is a candidate.
    return platform.rules.some(rule => {

      // Within each rule, there may be multiple clauses, e.g. "up purple".
      // Both clauses within the same rule must match for this rule to be
      // satisfied.
      const clauses = rule.split(" ");
      return clauses.every(clause => {

        // Clauses can be inverted with the bang symbol at the start, e.g.
        // "!purple" means every service that isn't on a purple line. So process
        // the clause without the bang, get the result, then invert the result
        // if the clause starts with a bang.
        const baseClause = clause.replace(/^!/g, "");
        const result = processClause(baseClause, lineData, clues);
        return clause.startsWith("!") ? !result : result;
      })
    })
  });

  // If after narrowing down the options only one platform remains, then return
  // that platform.
  if (matches.length == 1) { return matches[0].id; }

  // If we couldn't narrow it down to one platform, return null.
  //
  // This could be expanded in the future to give multiple options as guesses,
  // e.g. it might still be helpful to display "Platform 15/16?" on the UI to a
  // Gippslander at Southern Cross even if we're not sure which of the two it
  // will be.
  return null;
}

/**
 * Returns true if the given clause matches the platform clues provided.
 * @param clause The clause, e.g. "purple".
 * @param line The line data, since it's already retrieved in the
 * {@line guesstimatePlatforms} function, and doing it again several times would
 * be wasteful.
 * @param clues Details about the service that might hint towards its platform.
 */
function processClause(clause: string, line: Line,
  clues: PlatformClues): boolean {

  // Direction based: "up", "down", "up-via-loop", etc.
  if (clause == "up" && directionIsUp(clues.direction)) { return true; }
  if (clause == "down" && directionIsDown(clues.direction)) { return true; }
  if (clause == clues.direction) { return true; }

  // Line based: "cyan", "regional", "suburban", "line-10", etc.
  if (clause == line.color) { return true; }
  if (clause == line.service) { return true; }
  if (idPattern(clause, "line", x => x == line.id)) { return true; }

  // Stopping pattern based: "stops-at-210", "terminates-at-15", etc.
  const stops = clues.stoppingPattern;
  const origin = stops[0];
  const terminus = stops[stops.length - 1];
  if (idPattern(clause, "stops-at", x => stops.includes(x))) { return true; }
  if (idPattern(clause, "originates-at", x => x == origin)) { return true; }
  if (idPattern(clause, "terminates-at", x => x == terminus)) { return true; }

  // Day of week based: "weekend", "weekday", "thu", etc.
  const dayOfWeek = clues.timetabledDayOfWeek;
  if (clause == "weekend" && dayOfWeek.isWeekend()) { return true; }
  if (clause == "weekday" && dayOfWeek.isWeekday()) { return true; }
  if (clause == dayOfWeek.getCodeName()) { return true; }

  // Doesn't match any clause (or has "none" clause).
  return false;
}

/**
 * Helper function to process rules like "stops-at-X" where X could be any stop
 * id. Returns false in the event clause does not start with the given prefix,
 * or the text after the prefix is not a number.
 * @param clause The clause, e.g. "stops-at-20".
 * @param prefix The prefix bit of the clause before the number, e.g. "stops-at"
 * for "stops-at-20".
 * @param predicate The function to determine whether the number is relevant to
 * the service clues. The argument passed to the function is the number
 * extracted from the string.
 */
function idPattern(clause: string, prefix: string,
  predicate: (value: number) => boolean): boolean {

  // Not the prefix? Then false...
  if (!clause.startsWith(`${prefix}-`)) { return false; }

  // Not a number after the prefix? Then false...
  const number = parseInt(clause.substring(prefix.length + 1));
  if (isNaN(number)) { return false; }

  // Otherwise try the predicate function...
  return predicate(number);
}

/**
 * Either stop="`stop`" or line="`line`" is invalid
 */
const dataMissing = (stop: StopID, line: LineID) => new Error(
  `Either stop="${stop}" or line="${line}" is invalid.`
)
