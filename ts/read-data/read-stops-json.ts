import { ensureArray, ensureInteger, ensureIntegerArray, ensureString, ensureStringArray } from "../ensure-type";
import { StopID } from "../network/id";
import { Platform } from "../network/platform";
import { Stop } from "../network/stop";
import { StopDictionary } from "../network/stop-dictionary";

export function readStopsJson(json: any): StopDictionary {
  let results = new StopDictionary();

  ensureArray(json.stops, "stops in stops.json").forEach((stopJson: any) => {
    let id = ensureInteger(stopJson.id, "stop ID");
    let name = ensureString(stopJson.name, `stop name (id=${id})`);
    let platforms = readPlatformsJson(stopJson.platforms, id);
    let urlName = ensureString(stopJson.urlName, `stop URL name (id=${id})`);
    let adjacent = readAdjacentJson(stopJson.adjacent, id);
    let ptvID = ensureInteger(stopJson.ptvID, `stop PTV ID (id=${id})`);
    results.add(new Stop(id, name, platforms, urlName, adjacent, ptvID));
  });

  return results;
}

function readPlatformsJson(json: any, stop: StopID): Platform[] {
  let results: Platform[] = []

  ensureArray(json, `platforms (id=${stop})`).forEach((platformJson: any) => {
    let id = ensureString(platformJson.id, `platform ID (stop=${stop})`);
    let name = ensureString(platformJson.name, `platform name (stop=${stop}, platform=${id})`);
    let rules = ensureStringArray(platformJson.rules, `platform rules (stop=${stop}, platform=${id}`);
    results.push(new Platform(id, name, rules));
  });

  return results;
}

function readAdjacentJson(json: any, stop: StopID): StopID[] {
  return ensureIntegerArray(json, `adjacent stops (stop=${stop})`);
}
