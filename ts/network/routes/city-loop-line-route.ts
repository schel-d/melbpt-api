import { requireNonNull } from "../../utils";
import { CityLoopPortal } from "../city-loop";
import { StopID } from "../id";
import { LineRoute } from "./line-route";

/**
 * Represents a line that is a linear sequence of stops until it reaches the
 * city loop. Because a train can travel either direction in the loop to reach
 * Flinders Street, or upon departing Flinders Street to reach the suburbs,
 * there are 4 possible directions these routes can run in.
 */
export class CityLoopLineRoute extends LineRoute {
  /**
   * The array of stops on this line, in order, from the down terminus (e.g.
   * Pakenham) to (and including) the city loop portal (e.g. Richmond). The five
   * city loop stations should not be included in this list.
   */
  stops: StopID[];

  /**
   * The city loop portal this line uses.
   */
  portal: CityLoopPortal;

  /**
   * Creates a new city loop line route.
   * @param stops See {@link CityLoopLineRoute.stops}
   * @param portal See {@link CityLoopLineRoute.portal}
   */
  constructor(stops: StopID[], portal: CityLoopPortal) {
    super("city-loop");
    requireNonNull(stops, portal)
    this.stops = stops;
    this.portal = portal;
  }
}
