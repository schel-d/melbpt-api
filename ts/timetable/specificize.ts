import { DateTime } from "luxon";
import { Network } from "../network/network";
import { posMod } from "../utils";
import { getServiceIDComponents, ServiceID } from "./id";
import { LocalDate } from "./local-date";
import { Service, ServiceStop } from "./service";
import { FullTimetableEntry } from "./timetable";

/**
 * The first Monday of 2022.
 */
const dateLoopBasis = DateTime.utc(2022, 1, 3);

/**
 * Returns the week number of the current week.
 * @param now The current time (by default at least, this value can override).
 */
export function getCurrWeekNumber(now = DateTime.now()): number {
  const numOfWeeks = now.diff(dateLoopBasis).as("weeks");
  return posMod(Math.floor(numOfWeeks), 36);
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

  const currWeek = getCurrWeekNumber(now);
  const lapWeek = posMod(currWeek + 18, 36);

  // Luxon agrees that the week starts on Monday.
  const date = now.startOf("week");

  let weekOffset = 0;
  if (currWeek >= lapWeek) {
    weekOffset = week > lapWeek ? (week - currWeek) : 36 - currWeek + week;
  }
  else {
    weekOffset = week <= lapWeek ? (week - currWeek) : -(36 - week + currWeek);
  }

  const result = LocalDate.fromLuxon(date.plus({ weeks: weekOffset }));
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
  const mondayInMelbourne = getMondayDate(idCmpts.week).toMelbDateTime()
  const dateInMelbourne = mondayInMelbourne.plus({ days: entry.dayOfWeek });

  const stops: ServiceStop[] = entry.times.map(t => {
    // Todo: Use platform rules to guesstimate platform.

    const timeInMelbourne = dateInMelbourne.plus({ minutes: t.time.minuteOfDay });
    return {
      stop: t.stop,
      time: timeInMelbourne.toUTC(),
      platform: null
    }
  });

  return new Service(id, entry.line, entry.direction, stops);
}

/**
 * "`week`" is not a valid week number.
 */
const invalidWeekNumber = (week: number) => new Error(
  `"${week}" is not a valid week number.`
)
