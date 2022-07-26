import { DateTime } from "luxon";
import { Network } from "../network/network";
import { InvalidParamError, retrieveParam, retrieveRequiredParam } from "../serve-api";
import { getDepartures } from "../timetable/get-departures";
import { encodeServiceID } from "../timetable/id";
import { Timetables } from "../timetable/timetables";
import { parseIntNull } from "../utils";
import { networkApiV1, NetworkApiV1Schema } from "./network-v1";

/**
 * Due to the way service ID week numbers loop every 36 weeks, the getDepartures
 * method has undefined behaviour for times more than 100 days in the past or
 * future. Therefore the API limits the consumer to this date range.
 */
const maxDaysFromPresent = 100;

/**
 * To avoid stressing the server unnecessarily, the maximum number of departures
 * is capped at 50.
 */
const maxCount = 50;

/**
 * The format of the response from this API. Fields can be added here, but any
 * other changes (modifications or removals) should instead be implemented as
 * a consecutive version of the API.
 */
type DeparturesApiV1Schema = {
  departures: {
    stop: number,
    timeUTC: string,
    line: number,
    service: string,
    direction: string,
    platform: string | null,
    setDownOnly: boolean,
    stops: {
      stop: number,
      timeUTC: string
    }[]
  }[],
  network: NetworkApiV1Schema | null
}

/**
 * API that returns information about a service, given the service ID.
 * This API also returns network information if the client provides an outdated
 * network hash.
 */
export function departuresApiV1(params: unknown, network: Network,
  timetables: Timetables): any {

  const stopString = retrieveRequiredParam(params, "stop");
  const timeString = retrieveRequiredParam(params, "time");
  const countString = retrieveRequiredParam(params, "count");
  const reverseString = retrieveRequiredParam(params, "reverse");
  const filterString = retrieveParam(params, "filter");
  const hash = retrieveRequiredParam(params, "hash");

  const stopID = parseIntNull(stopString);
  if (stopID == null) { throw invalidStopIDError(stopString); }

  const stop = network.stops.get(stopID);
  if (stop == null) { throw stopNotFound(stopID); }

  const time = DateTime.fromISO(timeString);
  if (!time.isValid) { throw invalidTimeError(timeString); }

  const daysAway = time.diffNow().as("days");
  if (daysAway < -maxDaysFromPresent || daysAway > maxDaysFromPresent) {
    throw timeRangeError(maxDaysFromPresent);
  }

  const count = parseIntNull(countString);
  if (count == null || count < 1) { throw invalidIntError(countString); }
  if (count > maxCount) { throw countTooLarge(count, maxCount); }

  const reverse = reverseString == "true";
  if (!["true", "false"].includes(reverseString)) {
    throw invalidBoolError(reverseString);
  }

  const departures = getDepartures(
    timetables, network, stop, time, count, reverse, filterString
  );

  return {
    departures: departures.map(d => {
      return {
        stop: d.stop,
        timeUTC: d.timeUTC.toISO(),
        line: d.line,
        service: encodeServiceID(d.service),
        direction: d.direction,
        platform: d.platform,
        setDownOnly: d.setDownOnly,
        stops: d.stops.map(s => {
          return {
            stop: s.stop,
            timeUTC: s.timeUTC.toISO()
          };
        })
      };
    }),
    network: network.hash == hash ? null : networkApiV1(network)
  };
}

/**
 * "`id`" is not a valid stop ID.
 */
const invalidStopIDError = (id: string) => new InvalidParamError(
  `"${id}" is not a valid stop ID.`
);

/**
 * No stop with ID "`id`" found.
 */
const stopNotFound = (id: number) => new InvalidParamError(
  `No stop with ID "${id}" found.`
);

/**
 * "`value`" is not a valid ISO6081 time.
 */
const invalidTimeError = (value: string) => new InvalidParamError(
  `"${value}" is not a valid ISO6081 time.`
);

/**
 * Cannot get departures over `range` days in the past/future.
 */
const timeRangeError = (range: number) => new InvalidParamError(
  `Cannot get departures over ${range.toFixed()} days in the past/future.`
);

/**
 * "`value`" is not a positive integer.
 */
const invalidIntError = (value: string) => new InvalidParamError(
  `"${value}" is not a positive integer.`
);

/**
 * "`value`" is not a boolean value.
 */
const invalidBoolError = (value: string) => new InvalidParamError(
  `"${value}" is not a boolean value.`
);

/**
 * `maximum` is the limit for count, so "`value`" is not allowed.
 */
const countTooLarge = (value: number, maximum: number) => new InvalidParamError(
  `${maximum.toFixed()} is the limit for count, so "${value.toFixed()}" is not allowed.`
);
