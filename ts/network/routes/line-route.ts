import { requireNonNull } from "../../utils";
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
  type: LineRouteType;

  /**
   * Creates a new line route.
   * @param type See {@link LineRoute.type}
   */
  constructor(type: LineRouteType) {
    requireNonNull(type);
    this.type = type;
  }
}
