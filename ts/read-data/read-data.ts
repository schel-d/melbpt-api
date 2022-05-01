import { readFile } from "fs";
import { promisify } from "util";
import { Network } from "../network/network";
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
 * given directory.
 * @param dirPath The direction where the data has been downloaded and extracted to.
 * @param hash The value used to determine if the client has up-to-date network information. Should be the date of the data release, e.g. "2022-04-30".
 */
export async function readData(dirPath: string, hash: string): Promise<Data> {
  let stopsFile = await readFileAsync(dirPath + "/stops.json", "utf-8");
  let stopsJson = JSON.parse(stopsFile);
  let stops = readStopsJson(stopsJson);

  let network = new Network(hash);
  network.stops = stops;
  return { network: network };
}
