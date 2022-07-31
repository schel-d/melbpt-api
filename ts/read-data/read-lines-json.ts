import { z } from "zod";
import { CityLoopPortals } from "../network/city-loop";
import { LineID, StopID } from "../network/id";
import { Line } from "../network/line";
import { LineDictionary } from "../network/line-dictionary";
import { LineColors, LineRouteTypes, LineServices } from "../network/line-enums";
import { Branch, BranchLineRoute } from "../network/routes/branch-line-route";
import { CityLoopLineRoute } from "../network/routes/city-loop-line-route";
import { LineRoute } from "../network/routes/line-route";
import { LinearLineRoute } from "../network/routes/linear-line-route";
import { StopDictionary } from "../network/stop-dictionary";

const RouteJson = z.object({
  type: z.enum(LineRouteTypes),
  stops: z.number().int().array().optional(),
  portal: z.enum(CityLoopPortals).optional(),
  branches: z.object({
    id: z.string(),
    stops: z.number().int().array()
  }).array().optional()
});

const LinesJson = z.object({
  lines: z.object({
    id: z.number().int(),
    name: z.string(),
    color: z.enum(LineColors),
    service: z.enum(LineServices),
    route: RouteJson,
    ptvRoutes: z.number().int().array(),
    tags: z.string().array(),
    description: z.string()
  }).array()
});

type LinesJson = z.infer<typeof LinesJson>;
type RouteJson = z.infer<typeof RouteJson>;

/**
 * Returns a line dictionary containing the line data parsed from the json
 * object provided. Errors will be thrown in any case where the format is
 * unexpected, however this function does a very minimal amount of validation.
 * @param json The json object from the line.json file on the data server.
 * @param stopData The stop dictionary that should have been read first, this
 * is used to provide terminus names to the routes.
 */
export function readLinesJson(json: unknown,
  stopData: StopDictionary): LineDictionary {

  const linesJson = LinesJson.parse(json);
  const results = new LineDictionary();

  linesJson.lines.forEach(l => {
    const route = readRouteJson(l.route, l.id, stopData);
    const line = new Line(
      l.id, l.name, l.color, l.service, route, l.ptvRoutes, l.tags,
      l.description
    );
    results.add(line);
  });

  return results;
}

/**
 * Returns the route object for this line, parsed from the given json.
 * @param json The json object representing the route.
 * @param line The line id this route is for. Used for error messages.
 * @param stopData The stop dictionary that should have been read first, this
 * is used to provide terminus names to the routes.
 */
function readRouteJson(json: RouteJson, line: LineID,
  stopData: StopDictionary): LineRoute {

  if (json.type == "linear") {
    const stops = json.stops;
    if (stops == null) { throw linearMissingStops(line); }

    const upTerminusName = getUpTerminusName(stops, line, stopData);
    const downTerminusName = getDownTerminusName(stops, line, stopData);
    return new LinearLineRoute(stops, upTerminusName, downTerminusName);
  }
  else if (json.type == "city-loop") {
    const stops = json.stops;
    if (stops == null) { throw cityLoopMissingStops(line); }

    const portal = json.portal;
    if (portal == null) { throw cityLoopMissingPortal(line); }

    const terminusName = getDownTerminusName(stops, line, stopData);
    return new CityLoopLineRoute(stops, portal, terminusName);
  }
  else if (json.type == "branch") {
    const branchesJson = json.branches;
    if (branchesJson == null) { throw branchMissingBranches(line); }

    const branches = branchesJson.map(b => {
      const upTerminusName = getUpTerminusName(b.stops, line, stopData);
      const downTerminusName = getDownTerminusName(b.stops, line, stopData);
      return new Branch(b.id, b.stops, upTerminusName, downTerminusName);
    });

    return new BranchLineRoute(branches);
  }
  else {
    throw badLineRouteType(json.type, line);
  }
}

/**
 * Returns the name of the first stop (the down terminus) in the given list of
 * stops.
 * @param stops The list of stops to query.
 * @param line The list id this request is for. Used for error messages.
 * @param stopsData The dictionary of stop data, read from the data server.
 */
function getDownTerminusName(stops: StopID[], line: LineID,
  stopsData: StopDictionary): string {

  const stop = stops[0];
  const name = stopsData.get(stop)?.name;
  if (name == null) {
    throw noTerminusData("down", line, stop);
  }
  return name;
}

/**
 * Returns the name of the last stop (the up terminus) in the given list of
 * stops. This should not be used for city loop routes.
 * @param stops The list of stops to query.
 * @param line The list id this request is for. Used for error messages.
 * @param stopsData The dictionary of stop data, read from the data server.
 */
function getUpTerminusName(stops: StopID[], line: LineID,
  stopsData: StopDictionary): string {

  const stop = stops[stops.length - 1];
  const name = stopsData.get(stop)?.name;
  if (name == null) {
    throw noTerminusData("up", line, stop);
  }
  return name;
}

/**
 * Linear route must have a "stops" list (line=`line`).
 */
const linearMissingStops = (line: LineID) => new Error(
  `Linear route must have a "stops" list (line=${line}).`
);

/**
 * City loop route must have a "stops" list (line=`line`).
 */
const cityLoopMissingStops = (line: LineID) => new Error(
  `City loop route must have a "stops" list (line=${line}).`
);

/**
 * City loop route must have a "portal" value (line=`line`).
 */
const cityLoopMissingPortal = (line: LineID) => new Error(
  `City loop route must have a "portal" value (line=${line}).`
);

/**
 * Branch route must have an array of "branches" (line=`line`).
 */
const branchMissingBranches = (line: LineID) => new Error(
  `Branch route must have an array of "branches" (line=${line}).`
);

/**
 * Couldn't find `dirName` terminus stop (line=`line`, stop=`stop`).
 */
const noTerminusData = (dirName: "up" | "down", line: LineID, stop: StopID) =>
  new Error(
    `Couldn't find ${dirName} terminus stop (line=${line}, stop=${stop}).`
  );

/**
 * Unrecognised line route type "`type`" (line=`line`).
 */
const badLineRouteType = (type: string, line: LineID) => new Error(
  `Unrecognised line route type "${type}" (line=${line}).`
);
