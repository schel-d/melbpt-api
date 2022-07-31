import { z } from "zod";
import { Platform } from "../network/platform";
import { Stop } from "../network/stop";
import { StopDictionary } from "../network/stop-dictionary";

const PlatformsJson = z.object({
  id: z.string(),
  name: z.string(),
  rules: z.string().array()
}).array();

const StopsJson = z.object({
  stops: z.object({
    id: z.number().int(),
    name: z.string(),
    platforms: PlatformsJson,
    urlName: z.string(),
    adjacent: z.number().int().array(),
    ptvID: z.number().int(),
    tags: z.string().array()
  }).array()
});

type StopsJson = z.infer<typeof StopsJson>;
type PlatformsJson = z.infer<typeof PlatformsJson>;

/**
 * Returns a stop dictionary containing the stop data parsed from the json
 * object provided. Errors will be thrown in any case where the format is
 * unexpected, however this function does a very minimal amount of validation.
 * @param json The json object from the stops.json file on the data server.
 */
export function readStopsJson(json: unknown): StopDictionary {
  const stopsJson = StopsJson.parse(json);
  const results = new StopDictionary();

  stopsJson.stops.forEach(s => {
    const platforms = readPlatformsJson(s.platforms);
    const stop = new Stop(
      s.id, s.name, platforms, s.urlName, s.adjacent, s.ptvID, s.tags
    );
    results.add(stop);
  });

  return results;
}

/**
 * Returns the platform data for this stop, parsed from the provided json
 * object.
 * @param json The platforms json object.
 */
function readPlatformsJson(json: PlatformsJson): Platform[] {
  const results: Platform[] = [];

  json.forEach(p => {
    const platform = new Platform(p.id, p.name, p.rules);
    results.push(platform);
  });

  return results;
}
