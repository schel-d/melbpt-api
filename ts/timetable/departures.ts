import { DateTime } from "luxon"
import { DirectionID, LineID, PlatformID, StopID } from "../network/id"
import { Stop } from "../network/stop"
import { ServiceID } from "./id"

export type Departure = {
  service: ServiceID,
  line: LineID,
  direction: DirectionID,
  platform: PlatformID | null,
  timeUTC: DateTime,
  stops: {
    stop: StopID,
    timeUTC: DateTime
  }[],
  setDownOnly: boolean
}

export function getDepartures(stop: Stop, time: DateTime, count: number,
  reverse: boolean, filter: string): Departure[] {

  return [];
}
