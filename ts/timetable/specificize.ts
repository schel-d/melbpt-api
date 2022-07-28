import { DateTime } from "luxon";
import { Network } from "../network/network";
import { posMod } from "../utils";
import { guesstimatePlatforms, PlatformClues } from "./guesstimate-platforms";
import { getServiceIDComponents, ServiceID } from "./id";
import { LocalDate } from "./local-date";
import { Service, ServiceStop } from "./service";
import { isSetDownOnly } from "./set-down-only";
import { FullTimetableEntry } from "./timetable";

/**
 * The first Monday of 2022.
 */
const dateLoopBasis = DateTime.utc(2022, 1, 3);

/**
 * Returns the week number of the given date.
 * @param dateUTC The date in UTC.
 */
export function getWeekNumberLuxon(dateUTC: DateTime): number {
  const numOfWeeks = dateUTC.diff(dateLoopBasis).as("weeks");
  return posMod(Math.floor(numOfWeeks), 36);
}

/**
 * Returns the week number of the given date.
 * @param date The date.
 */
export function getWeekNumber(date: LocalDate): number {
  return getWeekNumberLuxon(date.toUTCDateTime());
}

/**
 * Returns the date of Monday on the week given by the {@link week} number
 * parameter.
 * @param week The week number to get Monday's date of.
 * @param now The current time (by default at least, this value can override).
 */
export function getMondayDate(week: number, now = DateTime.now()): LocalDate {
  if (week < 0 || week >= 36 || !Number.isInteger(week)) {
    throw invalidWeekNumber(week);
  }

  const currWeek = getWeekNumberLuxon(now);

  // Calculate how many weeks it is until the next week with the requested
  // number. Also calculate how many week it has been since the previous one.
  const difference = week - currWeek;
  const nextWeekOffset = difference >= 0 ? difference : difference + 36;
  const prevWeekOffset = difference < 0 ? difference : difference - 36;

  // If the next week occurs within 18 weeks, use it. Otherwise use the previous
  // week which will be at most 17 weeks ago.
  const chosenOffset = nextWeekOffset <= 18 ? nextWeekOffset : prevWeekOffset;

  // Luxon agrees that the week starts on Monday.
  const date = now.startOf("week");
  const result = LocalDate.fromLuxon(date.plus({ weeks: chosenOffset }));

  return result;
}

/**
 * Converts a timetable entry to a specific calendar day service, using the week
 * number component of the given service ID. This is also the moment platform
 * guesstimation occurs.
 * @param entry The timetable entry to become a service.
 * @param id The service ID, which informs the week the service occurs in.
 * @param network The network information, used to guesstimate platforms.
 */
export function specificize(entry: FullTimetableEntry, id: ServiceID,
  network: Network): Service {

  const idCmpts = getServiceIDComponents(id);
  const mondayInMelbourne = getMondayDate(idCmpts.week).toMelbDateTime();

  const daysSinceMonday = entry.dayOfWeek.daysSinceMonday;
  const dateInMelbourne = mondayInMelbourne.plus({ days: daysSinceMonday });

  // Construct here for the clues, rather than every stop.
  const stoppingPattern = entry.times.map(t => t.stop);

  const stops: ServiceStop[] = entry.times.map(t => {
    const timeInMelbourne = dateInMelbourne.plus({ minutes: t.time.minuteOfDay });
    const timeUTC = timeInMelbourne.toUTC();

    // Use platform rules to guesstimate platform. If at some point in the
    // future timetables already have platform information in them, this bit
    // can be overridden by those valuse and skipped.
    const clues: PlatformClues = {
      line: entry.line,
      direction: entry.direction,
      stoppingPattern: stoppingPattern,
      timetabledDayOfWeek: entry.dayOfWeek,
      timeUTC: timeUTC
    };
    const platform = guesstimatePlatforms(network, t.stop, clues);

    const sdo = isSetDownOnly(network, t.stop, entry.line, entry.direction);

    return {
      stop: t.stop,
      timeUTC: timeUTC,
      platform: platform,
      setDownOnly: sdo
    };
  });

  return new Service(id, entry.line, entry.direction, entry.dayOfWeek, stops);
}

/**
 * "`week`" is not a valid week number.
 */
const invalidWeekNumber = (week: number) => new Error(
  `"${week}" is not a valid week number.`
);
