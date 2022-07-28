import {
  CityLoopPortal, FLINDERS_STREET_NAME, stopsToFlindersDirect,
  stopsToFlindersViaLoop
} from "../city-loop";
import { Direction } from "../direction";
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
  readonly stops: StopID[];

  /**
   * The city loop portal this line uses.
   */
  readonly portal: CityLoopPortal;

  /**
   * The name of the down terminus, e.g. "Pakenham". Provided to the line object
   * since it has no access to stop names and uses it for direction names.
   */
  readonly terminusName: string;

  /**
   * Creates a new city loop line route.
   * @param stops See {@link CityLoopLineRoute.stops}
   * @param portal See {@link CityLoopLineRoute.portal}
   * @param terminusName See {@link CityLoopLineRoute.terminusName}
   */
  constructor(stops: StopID[], portal: CityLoopPortal, terminusName: string) {
    super("city-loop");
    this.stops = stops;
    this.portal = portal;
    this.terminusName = terminusName;
  }

  // JSDoc inherited from base class.
  createDirections(): Direction[] {
    return [
      new Direction(
        "up-direct",
        FLINDERS_STREET_NAME,
        [...this.stops, ...stopsToFlindersDirect(this.portal)]
      ),
      new Direction(
        "up-via-loop",
        FLINDERS_STREET_NAME + " via City Loop",
        [...this.stops, ...stopsToFlindersViaLoop(this.portal)]
      ),
      new Direction(
        "down-direct",
        this.terminusName,
        [...this.stops, ...stopsToFlindersDirect(this.portal)].reverse()
      ),
      new Direction(
        "down-via-loop",
        this.terminusName + " via City Loop",
        [...this.stops, ...stopsToFlindersViaLoop(this.portal)].reverse()
      )
    ];
  }
}
