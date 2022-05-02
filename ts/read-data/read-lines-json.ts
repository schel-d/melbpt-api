import { ensureArray, ensureInteger, ensureIntegerArray, ensureString } from "../ensure-type";
import { parseCityLoopPortal } from "../network/city-loop";
import { LineID, StopID } from "../network/id";
import { Line } from "../network/line";
import { LineDictionary } from "../network/line-dictionary";
import { parseLineColor, parseLineRouteType, parseLineService } from "../network/line-enums";
import { Branch, BranchLineRoute } from "../network/routes/branch-line-route";
import { CityLoopLineRoute } from "../network/routes/city-loop-line-route";
import { LineRoute } from "../network/routes/line-route";
import { LinearLineRoute } from "../network/routes/linear-line-route";
import { StopDictionary } from "../network/stop-dictionary";

/**
 * Returns a line dictionary containing the line data parsed from the json
 * object provided. Errors will be thrown in any case where the format is
 * unexpected, however this function does a very minimal amount of validation.
 * @param json The json object from the line.json file on the data server.
 * @param stopsData The stop dictionary that should have been read first, this is used to provide terminus names to the routes.
 */
export function readLinesJson(json: any, stopsData: StopDictionary): LineDictionary {
  let results = new LineDictionary();

  ensureArray(json.lines, "lines in lines.json").forEach((lineJson: any) => {
    let id = ensureInteger(lineJson.id, "line ID");
    let name = ensureString(lineJson.name, `line name (id=${id})`);
    let color = parseLineColor(ensureString(lineJson.color, `line color (id=${id})`));
    let service = parseLineService(ensureString(lineJson.service, `line service (id=${id})`));
    let route = readRouteJson(lineJson.route, id, stopsData);
    let ptvRoutes = ensureIntegerArray(lineJson.ptvRoutes, `line ptv routes (id=${id})`);

    results.add(new Line(id, name, color, service, route, ptvRoutes));
  });

  return results;
}

/**
 * Returns the route object for this line, parsed from the given json.
 * @param json The json object representing the route.
 * @param line The line id this route is for. Used for error messages.
 * @param stopsData The stop dictionary that should have been read first, this is used to provide terminus names to the routes.
 */
function readRouteJson(json: any, line: LineID, stopsData: StopDictionary): LineRoute {
  let type = parseLineRouteType(ensureString(json.type, `route type (line=${line})`));
  if (type == "linear") {
    let stops = ensureIntegerArray(json.stops, `linear route stops (line=${line})`);
    let upTerminusName = getUpTerminusName(stops, line, stopsData);
    let downTerminusName = getDownTerminusName(stops, line, stopsData);
    return new LinearLineRoute(stops, upTerminusName, downTerminusName);
  }
  else if (type == "city-loop") {
    let stops = ensureIntegerArray(json.stops, `city loop route stops (line=${line})`);
    let portal = parseCityLoopPortal(ensureString(json.portal, `city loop portal (line=${line})`));
    let terminusName = getDownTerminusName(stops, line, stopsData);
    return new CityLoopLineRoute(stops, portal, terminusName);
  }
  else if (type == "branch") {
    let branches = ensureArray(json.branches, `branch route branches (line=${line})`).map(branchJson => {
      let id = ensureString(branchJson.id, `branch ID (line=${line})`);
      let stops = ensureIntegerArray(branchJson.stops, `branch stops (line=${line}, branch="${id}")`);
      let upTerminusName = getUpTerminusName(stops, line, stopsData);
      let downTerminusName = getDownTerminusName(stops, line, stopsData);
      return new Branch(id, stops, upTerminusName, downTerminusName);
    })
    return new BranchLineRoute(branches);
  }
  else {
    throw new Error(`Unrecognised line route type "${type}" (line=${line}).`)
  }
}

/**
 * Returns the name of the first stop (the down terminus) in the given list of
 * stops.
 * @param stops The list of stops to query.
 * @param line The list id this request is for. Used for error messages.
 * @param stopsData The dictionary of stop data, read from the data server.
 */
function getDownTerminusName(stops: StopID[], line: LineID, stopsData: StopDictionary): string {
  let stop = stops[0];
  let name = stopsData.get(stop)?.name;
  if (name == null) {
    throw new Error(`Couldn't find down terminus stop (line=${line}, stop=${stop}).`);
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
function getUpTerminusName(stops: StopID[], line: LineID, stopsData: StopDictionary): string {
  let stop = stops[stops.length - 1]
  let name = stopsData.get(stop)?.name;
  if (name == null) {
    throw new Error(`Couldn't find up terminus stop (line=${line}, stop=${stop}).`);
  }
  return name;
}
