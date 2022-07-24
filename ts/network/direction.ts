import { DirectionID, StopID } from "./id";

/**
 * Represents information about a direction of travel on a line, such as the
 * name of the direction.
 */
export class Direction {
  /**
   * The unique identifier for this direction. Must be unique for the line it
   * serves only.
   */
  readonly id: DirectionID;

  /**
   * The name of this direction for this line. Names of the same direction will
   * differ between lines, e.g. the `"down"` direction will be "Pakenham" for
   * the Pakenham line, but "Cranbourne" for the Cranbourne line.
   */
  readonly name: string;

  /**
   * The list of stops in order, for this direction.
   */
  readonly stops: StopID[];

  /**
   * Creates a new direction.
   * @param id See {@link Direction.id}.
   * @param name See {@link Direction.name}.
   * @param stops See {@link Direction.stops}.
   */
  constructor(id: DirectionID, name: string, stops: StopID[]) {
    this.id = id;
    this.name = name;
    this.stops = stops;
  }
}

/**
 * Returns true if the given direction is considered to be an "up" direction.
 * Note that this function must be manually modified to match up direction
 * names if more are added in the future. Note that this function returning
 * false does not indicate the direction is some flavour of "down" direction,
 * use {@link isDirectionDown} instead. There may be cases in the future where
 * the direction is neither up nor down, e.g. the SRL?
 * @param direction The relevant specific direction.
 */
export function isDirectionUp(direction: DirectionID) {
  return direction == "up" || direction == "up-direct" ||
    direction == "up-via-loop" || direction.endsWith("-up");
}

/**
 * Returns true if the given direction is considered to be a "down" direction.
 * Note that this function must be manually modified to match down direction
 * names if more are added in the future. Note that this function returning
 * false does not indicate the direction is some flavour of "up" direction,
 * use {@link isDirectionUp} instead. There may be cases in the future where
 * the direction is neither up nor down, e.g. the SRL?
 * @param direction The relevant specific direction.
 */
export function isDirectionDown(direction: DirectionID) {
  return direction == "down" || direction == "down-direct" ||
    direction == "down-via-loop" || direction.endsWith("-down");
}
