import { LineDictionary } from "./line-dictionary";
import { StopDictionary } from "./stop-dictionary";

/**
 * Represents the data for all the stops and lines on the network. Does not
 * include timetable information.
 */
export class Network {
  /**
   * The value used to determine if the client has up-to-date network
   * information. Usually the date of the data release, e.g. "2022-04-30".
   */
  readonly hash: string;

  /**
   * Contains all the stops in the network.
   */
  readonly stops: StopDictionary;

  /**
   * Contains all the lines in the network.
   */
  readonly lines: LineDictionary;

  /**
   * Creates an empty network object.
   * @param hash The value used to determine if the client has up-to-date
   * network information. Usually the date of the data release, e.g.
   * "2022-04-30".
   */
  constructor(hash: string, stops: StopDictionary, lines: LineDictionary) {
    this.hash = hash;
    this.stops = stops;
    this.lines = lines;
  }
}
