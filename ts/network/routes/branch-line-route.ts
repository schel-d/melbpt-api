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
  readonly branches: Branch[];

  /**
   * Creates a new branch line route.
   * @param branches See {@link BranchLineRoute.branches}
   */
  constructor(branches: Branch[]) {
    super("branch");
    this.branches = branches;
  }

  // JSDoc inherited from base class.
  createDirections(): Direction[] {
    const result: Direction[] = [];
    this.branches.forEach(b => {
      result.push(new Direction(
        b.id + "-up",
        b.upTerminusName,
        [...b.stops]
      ));
      result.push(new Direction(
        b.id + "-down",
        b.downTerminusName,
        [...b.stops].reverse()
      ));
    });
    return result;
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
   * The unique identifier for this branch, which becomes a prefix for the
   * direction names, e.g. branch with id `"echuca"` runs in directions
   * `"echuca-up"` and `"echuca-down"`.
   */
  readonly id: string;

  /**
   * The name of the up terminus, e.g. "Southern Cross". Provided to the
   * branch object since it has no access to stop names and uses it for
   * direction names.
   */
  readonly upTerminusName: string;

  /**
   * The name of the down terminus, e.g. "Echuca". Provided to the branch object
   * since it has no access to stop names and uses it for direction names.
   */
  readonly downTerminusName: string;

  /**
   * The stops in this branch, in order, from the down terminus (e.g. Echuca)
   * all the way to the up terminus (e.g. Southern Cross). The branches don't
   * solely contain their exclusive stops, but also the stops common to both
   * branches.
   */
  readonly stops: StopID[];

  /**
   * Creates a new branch for a branch line route.
   * @param id See {@link Branch.id}.
   * @param stops See {@link Branch.stops}.
   * @param upTerminusName See {@link Branch.upTerminusName}.
   * @param downTerminusName See {@link Branch.downTerminusName}.
   */
  constructor(id: string, stops: StopID[], upTerminusName: string,
    downTerminusName: string) {

    this.id = id;
    this.upTerminusName = upTerminusName;
    this.downTerminusName = downTerminusName;
    this.stops = stops;
  }
}
