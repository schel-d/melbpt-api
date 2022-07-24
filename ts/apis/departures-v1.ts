import { DateTime } from "luxon";
import { Network } from "../network/network";
import { InvalidParamError, retrieveRequiredParam } from "../serve-api";
import { getDepartures } from "../timetable/departures";
import { encodeServiceID } from "../timetable/id";
import { Timetables } from "../timetable/timetables";
import { parseIntNull } from "../utils";
import { networkApiV1, NetworkApiV1Schema } from "./network-v1";

/**
 * The format of the response from this API. Fields can be added here, but any
 * other changes (modifications or removals) should instead be implemented as
 * a consecutive version of the API.
 */
type DeparturesApiV1Schema = {
  departures: {
    service: string,
    line: number,
    direction: string,
    platform: string | null,
    timeUTC: string,
    stops: {
      stop: number,
      timeUTC: string
    }[],
    setDownOnly: boolean
  }[],
  network: NetworkApiV1Schema | null
}

/**
 * API that returns information about a service, given the service ID.
 * This API also returns network information if the client provides an outdated
 * network hash.
 */
export function departuresApiV1(params: unknown, network: Network,
  timetables: Timetables): DeparturesApiV1Schema {

  const stopString = retrieveRequiredParam(params, "stop");
  const timeString = retrieveRequiredParam(params, "time");
  const countString = retrieveRequiredParam(params, "count");
  const reverseString = retrieveRequiredParam(params, "reverse");
  const filterString = retrieveRequiredParam(params, "filter");
  const hash = retrieveRequiredParam(params, "hash");

  const stopID = parseIntNull(stopString);
  if (stopID == null) { throw invalidStopIDError(stopString); }

  const stop = network.stops.get(stopID);
  if (stop == null) { throw stopNotFound(stopID); }

  const time = DateTime.fromISO(timeString);
  if (!time.isValid) { throw invalidTimeError(timeString); }

  // Todo: Throw an error if the time if outside the 30 day boundary.

  const count = parseIntNull(countString);
  if (count == null || count < 1) { throw invalidIntError(countString); }

  const reverse = reverseString == "true";
  if (!["true", "false"].includes(reverseString)) {
    throw invalidBoolError(reverseString);
  }

  // Todo: Validate the filter which might be something like "platform-2" or
  // "line-10".

  const departures = getDepartures(stop, time, count, reverse, filterString);

  return {
    departures: departures.map(d => {
      return {
        service: encodeServiceID(d.service),
        line: d.line,
        direction: d.direction,
        platform: d.platform,
        timeUTC: d.timeUTC.toISO(),
        stops: d.stops.map(s => {
          return {
            stop: s.stop,
            timeUTC: s.timeUTC.toISO()
          };
        }),
        setDownOnly: d.setDownOnly
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