import { LineID } from "./id";
import { Line } from "./line";

/**
 * A dictionary where line data be can accessed by ID.
 */
export class LineDictionary {
  _inner: { [line: LineID]: Line } = {};

  /**
   * Add a line to the dictionary.
   */
  add(line: Line) {
    this._inner[line.id] = line;
  }

  /**
   * Retrieve a line's data from the dictionary.
   * @param lineID The ID of the line to find.
   * @returns The line data, or undefined if no line with that ID is present.
   */
  get(lineID: LineID): Line | undefined {
    return this._inner[lineID];
  }

  /**
   * Checks whether a given line is present in the dictionary.
   * @param lineID The ID of the line to find.
   * @returns `true` if a line with that ID is in this dictionary.
   */
  has(lineID: LineID): boolean {
    return this.get(lineID) != undefined;
  }

  /**
   * Compiles a list of line IDs from this dictionary.
   * @returns A list of every line's ID that is found in this dictonary.
   */
  ids(): LineID[] {
    const lineIDs: LineID[] = Object.keys(this._inner).map(x => parseInt(x));
    return lineIDs;
  }

  /**
   * Converts the dictionary to an array.
   * @returns The contents of this dictionary as an array.
   */
  values(): Line[] {
    return this.ids().map(x => this._inner[x]);
  }

  /**
   * Get the first line in this dictionary.
   * @returns The first line that was added to this dictionary.
   */
  getFirst(): Line {
    return this.values()[0];
  }

  /**
   * Counts the lines in this dictionary.
   * @returns The number of lines in this dictionary.
   */
  count(): number {
    return this.ids().length;
  }
}
