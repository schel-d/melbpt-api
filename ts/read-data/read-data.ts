import { readFile } from "fs";
import { promisify } from "util";
import { Network } from "../network/network";
import { readLinesJson } from "./read-lines-json";
import { readStopsJson } from "./read-stops-json";

const readFileAsync = promisify(readFile);

/**
 * Represents the complete set of data parsed from the data server. This will
 * include network (stops and lines), and timetable information.
 */
export type Data = {
  network: Network;
}

/**
 * Parses the complete set of data downloaded from the data server, from the
 * given directory. Errors will be thrown in any case where the format is
 * unexpected, however this function does a very minimal amount of validation.
 * @param dirPath The directory where the data has been downloaded and extracted
 * to.
 * @param hash The value used to determine if the client has up-to-date network
 * information. Usually the date of the data release, e.g. "2022-04-30".
 */
export async function readData(dirPath: string, hash: string): Promise<Data> {
  let stopsFile = await readFileAsync(dirPath + "/stops.json", "utf-8");
  let stops = readStopsJson(JSON.parse(stopsFile));

  let linesFile = await readFileAsync(dirPath + "/lines.json", "utf-8");
  let lines = readLinesJson(JSON.parse(linesFile), stops);

  let network = new Network(hash);
  network.stops = stops;
  network.lines = lines;
  return { network: network };
}
