import { requireNonNull } from "../../utils";
import { Direction, GeneralDirection } from "../direction";
import { DirectionID, GeneralDirectionID, StopID } from "../id";
import { LineRoute } from "./line-route";

export type LinearDirectionNamingScheme = {
  up: { name: string, shortName: string },
  down: { name: string, shortName: string }
}

/**
 * Represents a line that simply travels between a group of stops, where there
 * are no loops or branches. Therefore are only two possible directions of
 * travel: `"up"` and `"down"`.
 */
export class LinearLineRoute extends LineRoute {
  /**
   * The array of stops on this line, in order, starting with the down terminus
   * (e.g. Pakenham) first.
   */
  stops: StopID[];

  /**
   * Contains the direction names for the up and down direction. The directions
   * are typically named after the terminus, e.g. "Southern Cross" for the up
   * direction and "Bairnsdale" for the down direction on the Gippsland line.
   * This object won't have access to stop names, otherwise this could be
   * calculated rather than passed in the constructor.
   */
  directionNames: LinearDirectionNamingScheme;

  /**
   * Creates a new linear line route.
   * @param stops See {@link LinearLineRoute.stops}
   */
  constructor(stops: StopID[], directionNames: LinearDirectionNamingScheme) {
    super("linear");
    requireNonNull(stops, directionNames);
    this.stops = stops;
    this.directionNames = directionNames;
  }

  // JSDoc inherited from LineRoute
  getGeneralDirections(): GeneralDirectionID[] {
    return ["up", "down"];
  }

  // JSDoc inherited from LineRoute
  getDirections(generalDirection?: GeneralDirectionID): DirectionID[] {
    if (generalDirection == null) { return ["up", "down"]; }
    if (generalDirection === "up") { return ["up"]; }
    if (generalDirection === "down") { return ["down"]; }
    throw `Unrecognized GeneralDirectionID for LinearLineRoute: "${generalDirection}"`
  }

  // JSDoc inherited from LineRoute
  getGeneralDirection(direction: GeneralDirectionID): GeneralDirection {
    if (direction === "up") {
      return new GeneralDirection(direction, this.directionNames.up.name,
        this.directionNames.up.shortName);
    }
    if (direction === "down") {
      return new GeneralDirection(direction, this.directionNames.down.name,
        this.directionNames.down.shortName);
    }
    throw `Unrecognized GeneralDirectionID for LinearLineRoute: "${direction}"`
  }

  // JSDoc inherited from LineRoute
  getDirection(direction: DirectionID): Direction {
    if (direction === "up") {
      return new Direction(direction, this.directionNames.up.name,
        this.directionNames.up.shortName);
    }
    if (direction === "down") {
      return new Direction(direction, this.directionNames.down.name,
        this.directionNames.down.shortName);
    }
    throw `Unrecognized DirectionID for LinearLineRoute: "${direction}"`
  }

  // JSDoc inherited from LineRoute
  getAllStops(): StopID[] {
    return [...this.stops];
  }

  // JSDoc inherited from LineRoute
  getStops(direction: DirectionID): StopID[] {
    if (direction === "up") { return [...this.stops]; }
    if (direction === "down") { return [...this.stops].reverse(); }
    throw `Unrecognized DirectionID for LinearLineRoute: "${direction}"`
  }
}
