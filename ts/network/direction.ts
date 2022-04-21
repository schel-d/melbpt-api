import { requireNonNull } from "../utils";
import { DirectionID, GeneralDirectionID } from "./id";

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
   * The shortened name of this direction for this line. Names of the same
   * direction will differ between lines, e.g. the `"down"` direction will be
   * "Pakenham" for the Pakenham line, but "Cranbourne" for the Cranbourne line.
   */
  shortName: string;

  /**
   * Creates a new direction.
   * @param id See {@link Direction.id}
   * @param name See {@link Direction.name}
   * @param shortName See {@link Direction.shortName}
   */
  constructor(id: DirectionID, name: string, shortName: string) {
    requireNonNull(id, name, shortName);
    this.id = id;
    this.name = name;
    this.shortName = shortName;
  }
}

/**
 * Represents information about a general direction of travel on a line, such as
 * the name of the direction.
 *
 * See {@link GeneralDirectionID} for more detail.
 */
export class GeneralDirection {
  /**
   * The unique identifier for this general direction. Must be unique for the
   * line it serves only.
   */
  id: GeneralDirectionID;

  /**
   * The name of this direction for this line. Names of the same direction will
   * differ between lines, e.g. the `"down"` direction will be "Pakenham" for
   * the Pakenham line, but "Cranbourne" for the Cranbourne line.
   */
  name: string;

  /**
   * The shortened name of this direction for this line. Names of the same
   * direction will differ between lines, e.g. the `"down"` direction will be
   * "Pakenham" for the Pakenham line, but "Cranbourne" for the Cranbourne line.
   */
  shortName: string;

  /**
   * Creates a new general direction.
   * @param id See {@link GeneralDirection.id}
   * @param name See {@link GeneralDirection.name}
   * @param shortName See {@link GeneralDirection.shortName}
   */
  constructor(id: GeneralDirectionID, name: string, shortName: string) {
    requireNonNull(id, name, shortName);
    this.id = id;
    this.name = name;
    this.shortName = shortName;
  }
}
