import { Direction } from "./direction";
import { LineID, StopID } from "./id";
import { LineColor, LineService } from "./line-enums";
import { LineRoute } from "./routes/line-route";
import { PTVRouteID } from "./ptv-id";

/**
 * Represents a train line, e.g. the "Pakenham" line.
 */
export class Line {
  /**
   * A unique identifier for this line. See {@link LineID}.
   */
  readonly id: LineID;

  /**
   * The display name of this line, without the word "line" in it, e.g.
   * "Pakenham".
   */
  readonly name: string;

  /**
   * The color that will be associated with this line. Tends to follow those
   * used by PTV, e.g. "cyan" for the Pakenham line.
   */
  readonly color: LineColor;

  /**
   * The type of service that runs on this line. Are these "suburban" or
   * "regional" trains?
   */
  readonly service: LineService;

  /**
   * Information about the route this line takes. Responsible for outlining
   * which stops this line serves in each possible direction it runs in.
   */
  readonly route: LineRoute;

  /**
   * One or more route IDs from the PTV API that represent this line.
   */
  readonly ptvRoutes: PTVRouteID[];

  /**
   * A list of tags used in search. Does not include the line's name.
   */
  readonly tags: string[];

  /**
   * A human-friendly short description of this line.
   */
  readonly description: string;

  /**
   * Information about each direction this line can run in. Created by the route
   * upon construction.
   */
  readonly directions: Direction[];

  /**
   * A list of all the stops that could be serviced by this line, in no
   * particular order.
   */
  readonly allStops: StopID[];

  /**
   * Creates a new line. Should only really be called when reading in data from
   * the data server.
   * @param id See {@link Line.id}.
   * @param name See {@link Line.name}.
   * @param color See {@link Line.color}.
   * @param service See {@link Line.service}.
   * @param route See {@link Line.route}.
   * @param ptvRoutes See {@link Line.ptvRoutes}.
   * @param tags See {@link Line.tags}.
   * @param description See {@link Line.description}.
   */
  constructor(id: LineID, name: string, color: LineColor, service: LineService,
    route: LineRoute, ptvRoutes: PTVRouteID[], tags: string[],
    description: string) {

    this.id = id;
    this.name = name;
    this.color = color;
    this.service = service;
    this.route = route;
    this.ptvRoutes = ptvRoutes;
    this.tags = tags;
    this.description = description;

    this.directions = this.route.createDirections();
    this.allStops = getAllStops(this.directions);
  }
}

/**
 * Returns a list of all the stops found in the directions passed. No stop will
 * be present more than once, and the order is not defined (cannot be relied
 * on).
 * @param directions The directions to extract the list of stops from.
 */
function getAllStops(directions: Direction[]): StopID[] {
  const results: StopID[] = [];
  directions.forEach(d => d.stops.forEach(s => {
    if (!results.includes(s)) {
      results.push(s);
    }
  }));
  return results;
}
