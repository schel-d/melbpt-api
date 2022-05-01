// import { ensureArray, ensureInteger, ensureIntegerArray, ensureString, ensureStringArray } from "../ensure-type";
// import { StopID } from "../network/id";
// import { LineDictionary } from "../network/line-dictionary";
// import { Platform } from "../network/platform";
// import { Stop } from "../network/stop";
// import { StopDictionary } from "../network/stop-dictionary";

// /**
//  * Returns a line dictionary containing the line data parsed from the json
//  * object provided. Errors will be thrown in any case where the format is
//  * unexpected, however this function does a very minimal amount of validation.
//  * @param json The json object from the line.json file on the data server.
//  */
// export function readLinesJson(json: any): LineDictionary {
//   let results = new LineDictionary();

//   ensureArray(json.stops, "stops in stops.json").forEach((stopJson: any) => {
//     let id = ensureInteger(stopJson.id, "stop ID");
//     let name = ensureString(stopJson.name, `stop name (id=${id})`);
//     let platforms = readPlatformsJson(stopJson.platforms, id);
//     let urlName = ensureString(stopJson.urlName, `stop URL name (id=${id})`);
//     let adjacent = ensureIntegerArray(stopJson.adjacent, `adjacent stops (stop=${id})`)
//     let ptvID = ensureInteger(stopJson.ptvID, `stop PTV ID (id=${id})`);
//     results.add(new Stop(id, name, platforms, urlName, adjacent, ptvID));
//   });

//   return results;
// }

// /**
//  * Returns the platform data for this stop, parsed from the provided json
//  * object.
//  * @param json The platforms json object.
//  * @param stop The current stop ID (used for error messages).
//  */
// function readPlatformsJson(json: any, stop: StopID): Platform[] {
//   let results: Platform[] = []

//   ensureArray(json, `platforms (id=${stop})`).forEach((platformJson: any) => {
//     let id = ensureString(platformJson.id, `platform ID (stop=${stop})`);
//     let name = ensureString(platformJson.name, `platform name (stop=${stop}, platform=${id})`);
//     let rules = ensureStringArray(platformJson.rules, `platform rules (stop=${stop}, platform=${id}`);
//     results.push(new Platform(id, name, rules));
//   });

//   return results;
// }
