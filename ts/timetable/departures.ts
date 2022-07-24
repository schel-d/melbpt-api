import { DateTime } from "luxon"
import { DirectionID, LineID, PlatformID, StopID } from "../network/id"
import { Stop } from "../network/stop"
import { ServiceID } from "./id"

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

export function getDepartures(stop: Stop, time: DateTime, count: number,
  reverse: boolean, filter: string): Departure[] {

  return [];
}
