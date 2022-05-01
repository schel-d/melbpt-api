import { requireNonNull } from "../utils";
import { LineDictionary } from "./line-dictionary";
import { StopDictionary } from "./stop-dictionary";

/**
 * Represents the data for all the stops and lines on the network. Does not
 * include timetable information.
 */
export class Network {
  /**
   * The value used to determine if the client has up-to-date network
   * information. Should be the date of the data release, e.g. "2022-04-30".
   */
  hash: string;

  /**
   * Contains all the stops in the network.
   */
  stops: StopDictionary;

  /**
   * Contains all the lines in the network.
   */
  lines: LineDictionary;

  /**
   * Creates an empty network object.
   * @param hash The value used to determine if the client has up-to-date network information. Should be the date of the data release, e.g. "2022-04-30".
   */
  constructor(hash: string) {
    requireNonNull(hash);
    this.hash = hash;
    this.stops = new StopDictionary();
    this.lines = new LineDictionary();
  }
}
