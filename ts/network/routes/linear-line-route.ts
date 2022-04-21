import { requireNonNull } from "../../utils";
import { StopID } from "../id";
import { LineRoute } from "./line-route";

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
   * Creates a new linear line route.
   * @param stops See {@link LinearLineRoute.stops}
   */
  constructor(stops: StopID[]) {
    super("linear");
    requireNonNull(stops);
    this.stops = stops;
  }
}
