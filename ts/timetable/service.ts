import { DateTime } from "luxon";
import { DirectionID, LineID, PlatformID, StopID } from "../network/id";
import { ServiceID } from "./id";

/**
 * Represents a stop on a service.
 */
export type ServiceStop = {
  stop: StopID, time: DateTime, platform: PlatformID | null;
}

/**
 * "Service" refers to pairing between a {@link TimetableEntry} and a specific
 * calendar day, i.e. the 4:17 Traralgon train from Southern Cross on the 22nd
 * of July, 2022.
 */
export class Service {
  /**
   * The service ID that uniquely indentifies this service.
   */
  readonly id: ServiceID;

  /**
   * The line this service runs on.
   */
  readonly line: LineID;

  /**
   * The direction this service travels on its {@link line}.
   */
  readonly direction: DirectionID;

  /**
   * The list of stops serviced by this service, and the time and platform (if
   * known) for each.
   */
  readonly stops: ServiceStop[];

  /**
   * Creates a {@link Service}.
   * @param id The service ID that uniquely indentifies this service.
   * @param line The line this service runs on.
   * @param direction The direction this service travels on its {@link line}.
   * @param stops The list of stops serviced by this service, and the time and
   * platform (if known) for each.
   */
  constructor(id: ServiceID, line: LineID, direction: DirectionID,
    stops: ServiceStop[]) {

    this.id = id;
    this.line = line;
    this.direction = direction;
    this.stops = stops;
  }
}
