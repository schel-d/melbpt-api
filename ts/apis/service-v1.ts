import { DateTime } from "luxon";
import { Network } from "../network/network";
import { InvalidParamError, retrieveRequiredParam } from "../serve-api";
import { encodeServiceID, getServiceIDComponents, parseServiceID, safeParseServiceID } from "../timetable/id";
import { getMondayDate, specificize } from "../timetable/specificize";
import { Timetables } from "../timetable/timetables";
import { networkApiV1, NetworkApiV1Schema } from "./network-v1";

/**
 * The format of the response from this API. Fields can be added here, but any
 * other changes (modifications or removals) should instead be implemented as
 * a consecutive version of the API.
 */
type ServiceApiV1Schema = {
  service: {
    id: string,
    line: number,
    direction: string,
    stops: {
      stop: number,
      timeUTC: string,
      platform: string | null
    }[]
  },
  network: NetworkApiV1Schema | null
}

/**
 * API that returns information about a service, given the service ID.
 * This API also returns network information if the client provides an outdated
 * network hash.
 */
export function serviceApiV1(params: unknown, network: Network,
  timetables: Timetables): ServiceApiV1Schema {

  const idString = retrieveRequiredParam(params, "id");
  const hash = retrieveRequiredParam(params, "hash");

  const id = safeParseServiceID(idString);
  if (id == null) { throw invalidIDError(idString); }

  const idCmpts = getServiceIDComponents(id);
  const entry = timetables.getEntryByIndex(idCmpts.timetable, idCmpts.index);
  if (entry == null) { throw serviceNotFound(idString); }

  const service = specificize(entry, id, network);

  return {
    service: {
      id: encodeServiceID(service.id),
      line: service.line,
      direction: service.direction,
      stops: service.stops.map(s => {
        return {
          stop: s.stop,
          timeUTC: s.time.toISO(),
          platform: s.platform
        }
      })
    },
    network: network.hash == hash ? null : networkApiV1(network)
  };
}

/**
 * "`id`" is not a valid service ID.
 */
const invalidIDError = (id: string) => new InvalidParamError(
  `"${id}" is not a valid service ID.`
);

/**
 * No service with ID "`id`" found.
 */
const serviceNotFound = (id: string) => new InvalidParamError(
  `No service with ID "${id}" found.`
);
