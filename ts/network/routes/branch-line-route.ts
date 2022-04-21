import { requireNonNull } from "../../utils";
import { Direction } from "../direction";
import { StopID } from "../id";
import { LineRoute } from "./line-route";

/**
 * Represents a line that may share some stops in common, but then branches form
 * basically two separate lines. This is used for cases like the "Bendigo" line,
 * where beyond Bendigo trains can travel either to Swan Hill on one branch or
 * Echuca on the other, however all these trains are still considered to be on
 * the "Bendigo line". More than two branches are allowed, and they don't *need*
 * to contain any stops in common, although when they do these stops must
 * appear in the same order each time.
 */
export class BranchLineRoute extends LineRoute {
  /**
   * Data for each branch this line can take, each with their own lists of stops
   * and direction IDs.
   */
  branches: Branch[];

  /**
   * Creates a new branch line route.
   * @param branches See {@link BranchLineRoute.branches}
   */
  constructor(branches: Branch[]) {
    super("branch")
    requireNonNull(branches);
    this.branches = branches;
  }
}

/**
 * Represents a linear group of stops that form one branch in a
 * {@link BranchLineRoute}. Each branch should have every stop in the direction
 * they represent, i.e. the branches don't solely contain their exclusive stops,
 * but also the stops common to both branches.
 */
export class Branch {
  /**
   * Details about the up direction for this stop.
   *
   * Note: two branches in the same line cannot use the same direction IDs, i.e.
   * use an ID like `"echuca-up"` rather than `"up"`.
   */
  upDirection: Direction;

  /**
   * Details about the down direction for this stop.
   *
   * Note: two branches in the same line cannot use the same direction IDs, i.e.
   * use an ID like `"echuca-down"` rather than `"down"`.
   */
  downDirection: Direction;

  /**
   * The stops in this branch, in order, from the down terminus (e.g. Echuca)
   * all the way to the up terminus (e.g. Southern Cross). The branches don't
   * solely contain their exclusive stops, but also the stops common to both
   * branches.
   */
  stops: StopID[];
  constructor(upDirection: Direction, downDirection: Direction, stops: StopID[]) {
    requireNonNull(upDirection, downDirection, stops)
    this.upDirection = upDirection;
    this.downDirection = downDirection;
    this.stops = stops;
  }
}
