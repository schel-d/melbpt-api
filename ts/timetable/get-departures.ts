import { DateTime } from "luxon"
import { isDirectionDown, isDirectionUp } from "../network/direction"
import { DirectionID, LineID, PlatformID, StopID } from "../network/id"
import { Line } from "../network/line"
import { Network } from "../network/network"
import { Stop } from "../network/stop"
import { ServiceID, serviceIDFromComponents, TimetableID } from "./id"
import { LocalDate } from "./local-date"
import { LocalTime } from "./local-time"
import { getWeekNumber, specificize } from "./specificize"
import { DayOfWeek, melbTimeZone } from "./time-utils"
import { Timetable } from "./timetable"
import { Timetables } from "./timetables"

export type Departure = {
  stop: StopID,
  timeUTC: DateTime,
  line: LineID,
  service: ServiceID,
  direction: DirectionID,
  platform: PlatformID | null,
  setDownOnly: boolean,
  stops: {
    stop: StopID,
    timeUTC: DateTime
  }[]
}

/**
 * Returns a list of next departures from a certain stop after a certain time.
 * @param timetables The timetables object to get timetable data from.
 * @param network The network object to get stops/lines data from.
 * @param stop The stop to get the departures from.
 * @param time The earliest (or latest if in reverse mode) departure to get.
 * @param count The number of departures to get. A lower value may be returned
 * if there aren't enough within a 14 day timespan to fill this quota.
 * @param reverse True if you want departures BEFORE the time rather than after.
 * @param filter A filter string, e.g. "platform-15a" or "nsdo narr", to filter
 * departures by before returning.
 */
export function getDepartures(timetables: Timetables, network: Network,
  stop: Stop, time: DateTime, count: number, reverse: boolean,
  filter: string): Departure[] {

  const lines = network.lines.stopAt(stop.id);
  const deps: Departure[] = [];

  const melbTime = time.setZone(melbTimeZone);
  let iterDay = LocalDate.fromLuxon(melbTime);
  let iterOffset = 0;

  while (iterOffset <= 14) {
    const minTime = iterOffset == 0 && !reverse ? LocalTime.fromLuxon(melbTime) : null;
    const maxTime = iterOffset == 0 && reverse ? LocalTime.fromLuxon(melbTime) : null;

    const possibilities = getCompletePossibilities(
      timetables, lines.map(l => l.id), stop.id, iterDay, reverse, minTime, maxTime
    );

    const preFilterDeps = possibilitiesToDeps(
      possibilities, timetables, network, stop.id
    );

    deps.push(...filterDepartures(preFilterDeps, filter, lines));

    if (deps.length >= count) { break; }

    iterDay = reverse ? iterDay.yesterday() : iterDay.tomorrow();
    iterOffset++;
  }

  return deps.slice(0, count);
}

/**
 * Returns the same list of departures but filtered according to the given
 * filter string.
 * @param deps The departures to filter.
 * @param filterStr The filter string.
 * @param lines The line information (used for filter by line service).
 */
function filterDepartures(deps: Departure[], filterStr: string,
  lines: Line[]): Departure[] {

  const filters = filterStr.split(" ");

  for (let filter of filters) {
    // "narr" stands for no arrivals. Removes services that terminate at this
    // stop.
    if (filter == "narr") {
      deps = deps.filter(d => d.stops[d.stops.length - 1].stop != d.stop)
    }

    // "nsdo" stands for no set down onlys. Removes services that are set down
    // only, e.g. up Gippsland services at Caulfield.
    if (filter == "nsdo") {
      deps = deps.filter(d => !d.setDownOnly);
    }

    if (filter == "up") {
      deps = deps.filter(d => isDirectionUp(d.direction));
    }

    if (filter == "down") {
      deps = deps.filter(d => isDirectionDown(d.direction));
    }

    if (filter.startsWith("direction-")) {
      const direction = filter.replace(/^direction-/g, "");
      deps = deps.filter(d => d.direction == direction);
    }

    if (filter.startsWith("line-")) {
      const line = filter.replace(/^line-/g, "");
      deps = deps.filter(d => d.line.toFixed() == line);
    }

    if (filter.startsWith("service-")) {
      const service = filter.replace(/^service-/g, "");
      const filterLines = lines.filter(l => l.service == service).map(l => l.id);
      deps = deps.filter(d => filterLines.includes(d.line));
    }

    if (filter.startsWith("platform-")) {
      const platform = filter.replace(/^platform-/g, "");
      deps = deps.filter(d => d.platform == platform);
    }
  }

  return deps;
}

/**
 * Converts {@link DeparturePossibility} objects to {@link Departure}, using
 * the {@link specificize} process.
 * @param possibilities The departure possibilities list.
 * @param timetables The timetables object, used for specificizing the departures.
 * @param network The network object, used for specificizing the departures.
 * @param stop The stop the departures depart from.
 */
function possibilitiesToDeps(possibilities: DeparturePossibility[],
  timetables: Timetables, network: Network, stop: StopID): Departure[] {

  const departures = possibilities.map(p => {
    const entry = timetables.getEntryByIndex(p.timetable, p.index);
    if (entry == null) { throw missingEntry(p.timetable, p.index); }

    const serviceID = serviceIDFromComponents(p.timetable, p.index, p.week);
    const service = specificize(entry, serviceID, network);

    const departureStop = service.stops.find(s => s.stop == stop);
    if (departureStop == null) { throw missingStop(); }

    return {
      stop: departureStop.stop,
      timeUTC: departureStop.timeUTC,
      line: entry.line,
      service: service.id,
      direction: service.direction,
      platform: departureStop.platform,
      setDownOnly: departureStop.setDownOnly,
      stops: service.stops.map(s => {
        return {
          stop: s.stop,
          timeUTC: s.timeUTC
        };
      })
    };
  });

  return departures;
}

type DeparturePossibility = {
  timetable: TimetableID,
  index: number,
  week: number,
  time: LocalTime
}

/**
 * Returns a sorted list of every departure on the given day of the week from
 * the given stop. This includes departures part of the previous day's timetable
 * that spill over onto the next day.
 * @param yesterdayTimetables The timetables for the day before. Use
 * {@link timetablesForDay} to build this list.
 * @param todayTimetables The timetables for today. Use {@link timetablesForDay}
 * to build this list.
 * @param stop The stop to get departures from.
 * @param dayOfWeek The day of week.
 * @param minTime Use this to filter departures by a minimum time. This time
 * cannot occur on the next day.
 * @param maxTime Use this to filter departures by a maximum time. This time
 * cannot occur on the next day.
 */
function getCompletePossibilities(timetables: Timetables, lines: LineID[],
  stop: StopID, date: LocalDate, reverse: boolean, minTime: LocalTime | null,
  maxTime: LocalTime | null): DeparturePossibility[] {

  if (minTime?.isNextDay() || maxTime?.isNextDay()) { throw illegalTime(); }

  const todayTimetables = timetablesForDay(date, timetables, lines);
  const yesterdayTimetables = timetablesForDay(date.yesterday(), timetables, lines);

  // When querying the services from yesterday, we only want the ones after
  // midnight. If the caller gives a further restriction we need to make it
  // 24 hours later from yesterday's point of view.

  const fromYesterday = getPossibilities(
    yesterdayTimetables,
    stop,
    date.yesterday(),
    minTime != null ? minTime.tomorrow() : LocalTime.startOfTomorrow(),
    maxTime != null ? maxTime.tomorrow() : null
  ).map(d => {
    return {
      timetable: d.timetable,
      index: d.index,
      week: d.week,
      time: d.time.yesterday()
    }
  });

  const fromToday = getPossibilities(
    todayTimetables,
    stop,
    date,
    minTime,
    maxTime != null ? maxTime : LocalTime.startOfTomorrow()
  )

  const sorted = fromYesterday.concat(fromToday).sort((a, b) =>
    (reverse ? -1 : 1) * (a.time.minuteOfDay - b.time.minuteOfDay));
  return sorted;
}

/**
 * Return all the services in the given timetables that occur on the given day
 * of week. A max time and min time can be given to further filter the list.
 * Note this function DOES NOT give services that are part of the previous days
 * timetable, but whose departures for this stop occur after midnight. Use
 * {@link getCompletePossibilities} for that.
 * @param timetables The timetables to retrieve services from. Use
 * {@link timetablesForDay} to build this list.
 * @param stop The stop to get departures of.
 * @param dayOfWeek The day of week to look at.
 * @param minTime Use this to filter a minimum time.
 * @param maxTime Use this to filter a maximum time.
 */
function getPossibilities(timetables: Timetable[], stop: StopID,
  date: LocalDate, minTime: LocalTime | null,
  maxTime: LocalTime | null): DeparturePossibility[] {

  const dayOfWeek = DayOfWeek.fromLuxon(date.toUTCDateTime());
  const week = getWeekNumber(date);

  const possibilities: DeparturePossibility[] = [];

  // For each timetable...
  timetables.forEach(t => {

    // Find each timetable section that is relevant to the given day of week.
    const sectionsOnDay = t.sections.filter(s => s.wdr.includes(dayOfWeek));

    // For each of those timetable sections...
    sectionsOnDay.forEach(s => {

      // Entries do not appear multiple times for Mon-Thu but do have a
      // different index, so we need to calculate that new index. Otherwise,
      // when we go to form the service ID later it will give the service of the
      // first day in the week day range only.
      const indexOffset = s.wdr.indexOf(dayOfWeek) * s.entries.length;

      // Find the entries that stop at the given stop.
      const entries = s.entries.filter(e => e.times.some(t => t.stop == stop));

      // For each of those entries...
      entries.forEach(e => {

        // Find when the entry stops at the given stop. The above filter
        // ensures that the entry does definitely stop at the stop.
        const stopTime = e.times.find(e => e.stop == stop)!.time;

        // Check if the entry falls outside the min/max times if they exist.
        const breaksMinTime = minTime != null && stopTime.isBefore(minTime);
        const breaksMaxTime = maxTime != null && stopTime.isAfter(maxTime);

        // If it doesn't, add it to the results.
        if (!breaksMinTime && !breaksMaxTime) {
          possibilities.push({
            timetable: t.id,
            index: e.index + indexOffset,
            week: week,
            time: stopTime
          });
        }
      });
    });
  });

  return possibilities;
}

/**
 * Returns the timetables in operation for the given {@link day} (considering
 * their begin and end dates) for the given list of {@link lines}.
 * @param day The day to retrieve timetables for.
 * @param timetables The timetables object storing the timetables.
 * @param lines The list of lines to get timetables for.
 */
function timetablesForDay(day: LocalDate, timetables: Timetables,
  lines: LineID[]): Timetable[] {

  const result: Timetable[] = [];
  for (const line of lines) {
    const thisLine = timetables.timetables.filter(x => x.line == line);
    const current = thisLine.filter(t => within(day, t.begins, t.ends));

    const temporary = current.filter(t => t.type == "temporary");
    if (temporary.length != 0) {
      // If there is a temporary timetable in operation, use it instead of the
      // "main" timetable. There really should only ever be one, but in the case
      // where there are multiple, use them all I guess.
      result.push(...temporary);
    }
    else {
      // Otherwise add the "main" timetable. Again, there should only be one, but
      // if there's multiple, we'll use them all.
      result.push(...current);
    }
  }
  return result;
}

/**
 * Returns true if the given {@link day} occurs within the {@link begins} and
 * {@link ends} dates. Null dates acts as wildcards, e.g. 2021-null means every
 * day after and including 2021.
 * @param day The day to check.
 * @param begins The minimum date, or null if there isn't a minimum date.
 * @param ends The maximum date, or null if there isn't a maximum date.
 */
function within(day: LocalDate, begins: LocalDate | null,
  ends: LocalDate | null): boolean {

  if (begins != null && day.isBefore(begins)) { return false; }
  if (ends != null && day.isAfter(ends)) { return false; }
  return true;
}

/**
 * Couldn't find entry for timetable=`timetable`, index=`index`.
 */
const missingEntry = (timetable: TimetableID, index: number) => new Error(
  `Couldn't find entry for timetable=${timetable}, index=${index}.`
);

/**
 * Proposed entry does not stop at required stop.
 */
const missingStop = () => new Error(
  `Proposed entry does not stop at required stop.`
);

/**
 * Time constraints cannot be next day.
 */
const illegalTime = () => new Error(
  `Time constraints cannot be next day.`
)
