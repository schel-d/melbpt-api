import { requireNonNull } from "../../utils";
import { Direction, GeneralDirection } from "../direction";
import { DirectionID, GeneralDirectionID, StopID } from "../id";
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

  /**
   * Returns a list of all the possible general directions this line has.
   *
   * See {@link GeneralDirectionID} for more detail.
   */
  abstract getGeneralDirections(): GeneralDirectionID[]

  /**
   * Returns a list of all the possible directions a train can travel in on this
   * line.
   */
  abstract getDirections(): DirectionID[]

  /**
   * Returns a list of all the possible directions a train can travel in on this
   * line, in this general direction. The possible inputs to this function
   * should match the outputs of {@link LineRoute.getGeneralDirections}. The
   * relative stop order in a general direction can be deduced by summing the
   * stops in each direction outputted here.
   *
   * See {@link GeneralDirectionID} for more detail.
   */
  abstract getDirections(generalDirection: GeneralDirectionID): DirectionID[]

  /**
   * Returns specific information about the given general direction.
   * @param direction The general direction to get more information about.
   */
  abstract getGeneralDirection(direction: GeneralDirectionID): GeneralDirection

  /**
   * Returns specific information about the given direction.
   * @param direction The direction to get more information about.
   */
  abstract getDirection(direction: DirectionID): Direction

  /**
   * Returns a list of all the stops served by this line, in any direction, in
   * no particular order.
   */
  abstract getAllStops(): StopID[]

  /**
   * Returns the list of stops, in order, that this line serves in the given
   * direction, e.g. [Flinders Street, Richmond, South Yarra, etc.] if given
   * `"up-direct"` for the Pakenham line.
   * @param direction The direction the stops that should be considered, and
   * that the list should be ordered in.
   */
  abstract getStops(direction: DirectionID): StopID[]
}
