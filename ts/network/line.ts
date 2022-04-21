import { requireNonNull } from "../utils";
import { LineID } from "./id";
import { LineColor, LineService } from "./line-enums";
import { LineRoute } from "./routes/line-route";

/**
 * Represents a train line, e.g. the "Pakenham" line.
 */
export class Line {
  /**
   * A unique identifier for this line. See {@link LineID}.
   */
  id: LineID;

  /**
   * The display name of this line, without the word "line" in it, e.g.
   * "Pakenham".
   */
  name: string;

  /**
   * The color that will be associated with this line. Tends to follow those
   * used by PTV, e.g. "cyan" for the Pakenham line.
   */
  color: LineColor;

  /**
   * The type of service that runs on this line. Are these "metro" or "regional"
   * trains?
   */
  service: LineService;

  /**
   * Information about the route this line takes. Responsible for outlining
   * which stops this line serves in each possible direction it runs in.
   */
  route: LineRoute;

  /**
   * Creates a new line. Should only really be called when reading in data from
   * the data server.
   * @param id See {@link Line.id}
   * @param name See {@link Line.name}
   * @param color See {@link Line.color}
   * @param service See {@link Line.service}
   * @param route See {@link Line.route}
   */
  constructor(id: LineID, name: string, color: LineColor, service: LineService,
    route: LineRoute) {

    requireNonNull(id, name, color, service, route);
    this.id = id;
    this.name = name;
    this.color = color;
    this.service = service;
    this.route = route;
  }
}
