import { requireNonNull } from "../utils";
import { StopID } from "./id";
import { Platform } from "./platform";
import { PTVStopID } from "./ptv-id";

/**
 * Represents the data known by `melbpt` for a particular stop.
 */
export class Stop {
  /**
   * The unique identifier used by `melbpt` for this stop (may not match the ID
   * used by the PTV API)
   */
  id: StopID;

  /**
   * The display name of this stop.
   */
  name: string;

  /**
   * The platform data for this stop.
   */
  platforms: Platform[];

  /**
   * Generally the display name of the stop, all lowercase, minus the spaces.
   * Should only contain a-z, and possibly 0-9. Should not be used to ID this
   * stop, as it will change if the name changes, but can be expected to be
   * unique.
   */
  urlName: string;

  /**
   * A list of stops that are adjacent to this stop in any direction. This is
   * best viewed visually on the Victorian Train Map. May be used for path
   * finding in the future.
   */
  adjacent: StopID[];

  /**
   * The stop ID as used by the PTV API.
   */
  ptvID: PTVStopID;

  /**
   * Creates a new stop. Should only really be called while reading in data from
   * the data server.
   * @param id See {@link Stop.id}
   * @param name See {@link Stop.name}
   * @param platforms See {@link Stop.platforms}
   * @param urlName See {@link Stop.urlName}
   * @param adjacent See {@link Stop.adjacent}
   * @param ptvID See {@link Stop.ptvID}
   */
  constructor(id: StopID, name: string, platforms: Platform[], urlName: string,
    adjacent: StopID[], ptvID: PTVStopID) {
    requireNonNull(id, name, platforms, urlName, adjacent, ptvID);
    this.id = id;
    this.name = name;
    this.platforms = platforms;
    this.urlName = urlName;
    this.adjacent = adjacent;
    this.ptvID = ptvID;
  }
}
