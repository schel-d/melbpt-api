import { Direction } from "../direction";
import { LineRouteType } from "../line-enums";

/**
 * Represents information about the route a line takes. Responsible for
 * outlining which stops this line serves in each possible direction it could
 * run in.
 */
export abstract class LineRoute {
  /**
   * The type of line route this is. Note {@link LineRoute} is an abstract
   * class.
   */
  readonly type: LineRouteType;

  /**
   * Creates a new line route.
   * @param type See {@link LineRoute.type}
   */
  constructor(type: LineRouteType) {
    this.type = type;
  }

  /**
   * Using the properties of this object, creates and fills out the details of
   * all the directions that this route can run in.
   */
  abstract createDirections(): Direction[]
}
