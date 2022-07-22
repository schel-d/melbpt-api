import { readFile } from "fs";
import { readdir } from "fs/promises";
import { extname, join } from "path";
import { promisify } from "util";
import { Network } from "../network/network";
import { Timetables } from "../timetable/timetables";
import { readLinesJson } from "./read-lines-json";
import { readStopsJson } from "./read-stops-json";
import { readTtbl } from "./read-ttbl";

const readFileAsync = promisify(readFile);

/**
 * Represents the complete set of data parsed from the data server. This will
 * include network (stops and lines), and timetable information.
 */
export type Data = {
  network: Network,
  timetables: Timetables
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
  const stopsFile = await readFileAsync(join(dirPath, "stops.json"), "utf-8");
  const stops = readStopsJson(JSON.parse(stopsFile));

  const linesFile = await readFileAsync(join(dirPath, "lines.json"), "utf-8");
  const lines = readLinesJson(JSON.parse(linesFile), stops);

  const network = new Network(hash, stops, lines);

  const files = (await readdir(dirPath)).filter(p => extname(p) == ".ttbl");
  const timetableList = [];

  for (const file of files) {
    // Todo: <TEMP>
    if (file != "60-gippsland.ttbl") { continue; }
    // </TEMP>

    const text = await readFileAsync(join(dirPath, file), "utf-8");
    const timetable = readTtbl(text, network);
    timetableList.push(timetable);
  }

  const timetables = new Timetables(timetableList);

  return { network: network, timetables: timetables };
}
