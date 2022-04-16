import { StopID } from "./id";
import { Stop } from "./stop";

/**
 * A dictionary where stop data be can accessed by ID.
 */
export class StopDictionary {
  _inner: { [stop: StopID]: Stop } = {};

  /**
   * Add a stop to the dictionary.
   */
  add(stop: Stop) {
    this._inner[stop.id] = stop;
  }

  /**
   * Retrieve a stop's data from the dictionary.
   * @param stopID The ID of the stop to find.
   * @returns The stop data, or undefined if no stop with that ID is present.
   */
  get(stopID: StopID): Stop | undefined {
    return this._inner[stopID];
  }

  /**
   * Checks whether a given stop is present in the dictionary.
   * @param stopID The ID of the stop to find.
   * @returns `true` if a stop with that ID is in this dictionary.
   */
  has(stopID: StopID): boolean {
    return this.get(stopID) != undefined;
  }

  /**
   * Compiles a list of stop IDs from this dictionary.
   * @returns A list of every stop's ID that is found in this dictonary.
   */
  ids(): StopID[] {
    const stopIDs: StopID[] = Object.keys(this._inner).map(x => parseInt(x));
    return stopIDs;
  }

  /**
   * Converts the dictionary to an array.
   * @returns The contents of this dictionary as an array.
   */
  values(): Stop[] {
    return this.ids().map(x => this._inner[x]);
  }

  /**
   * Finds the stop ID from a stop's name.
   * @param stopName The name of the stop.
   * @returns The stop ID of the stop which exactly matches that name.
   */
  fromName(stopName: string): StopID | undefined {
    return this.values().find(x => x.name === stopName)?.id ?? undefined;
  }

  /**
   * Get the first stop in this dictionary.
   * @returns The first stop that was added to this dictionary.
   */
  getFirst(): Stop {
    return this.values()[0];
  }

  /**
   * Counts the stops in this dictionary.
   * @returns The number of stops in this dictionary.
   */
  count(): number {
    return this.ids().length;
  }
}
