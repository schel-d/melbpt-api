import { Direction } from "../direction";
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
  readonly stops: StopID[];

  /**
   * The name of the up terminus, e.g. "Southern Cross". Provided to the line
   * object since it has no access to stop names and uses it for direction
   * names.
   */
  readonly upTerminusName: string;

  /**
   * The name of the down terminus, e.g. "Pakenham". Provided to the line object
   * since it has no access to stop names and uses it for direction names.
   */
  readonly downTerminusName: string;

  /**
   * Creates a new linear line route.
   * @param stops See {@link LinearLineRoute.stops}.
   * @param upTerminusName See {@link LinearLineRoute.upTerminusName}.
   * @param downTerminusName See {@link LinearLineRoute.downTerminusName}.
   */
  constructor(stops: StopID[], upTerminusName: string,
    downTerminusName: string) {

    super("linear");
    this.stops = stops;
    this.upTerminusName = upTerminusName;
    this.downTerminusName = downTerminusName;
  }

  // JSDoc inherited from base class.
  createDirections(): Direction[] {
    return [
      new Direction(
        "up",
        this.upTerminusName,
        [...this.stops]
      ),
      new Direction(
        "down",
        this.downTerminusName,
        [...this.stops].reverse()
      )
    ]
  }
}
