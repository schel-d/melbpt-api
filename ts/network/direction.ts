import { requireNonNull } from "../utils";
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
  id: DirectionID;

  /**
   * The name of this direction for this line. Names of the same direction will
   * differ between lines, e.g. the `"down"` direction will be "Pakenham" for
   * the Pakenham line, but "Cranbourne" for the Cranbourne line.
   */
  name: string;

  /**
   * The list of stops in order, for this direction.
   */
  stops: StopID[];

  /**
   * Creates a new direction.
   * @param id See {@link Direction.id}.
   * @param name See {@link Direction.name}.
   * @param stops See {@link Direction.stops}.
   */
  constructor(id: DirectionID, name: string, stops: StopID[]) {
    requireNonNull(id, name, stops);
    this.id = id;
    this.name = name;
    this.stops = stops;
  }
}
