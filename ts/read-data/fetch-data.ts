import extract from "extract-zip";
import { createWriteStream, existsSync, mkdir, rm } from "fs";
import got from "got";
import { basename, resolve } from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { Data, readData } from "./read-data";

const DATA_MANIFEST_URL = "https://data.trainarrives.in/latest.json";
type LatestJsonType = {
  versions: {
    [version: string]: {
      latest: string,
      backup: string
    }
  }
}

const DATA_VERSION = "v2";
const DATA_TEMP_LOCATION = "./.out/.data";
const DATA_TEMP_LOCATION_ZIP = DATA_TEMP_LOCATION + "/data.zip";

const deleteDir = promisify(rm);
const createDir = promisify(mkdir);
const pipelineAsync = promisify(pipeline);

/**
 * Download the stop, line, and timetable data from the data server
 * (probably https://data.trainarrives.in).
 */
export async function fetchData(): Promise<Data> {
  // Download the json type that indicates where the latest data can be found.
  let manifestJson: LatestJsonType;
  try {
    manifestJson = await got.get(DATA_MANIFEST_URL).json() as LatestJsonType;
  }
  catch {
    throw new Error(`There was not a json file at "${DATA_MANIFEST_URL}"`);
  }

  // Get the url for the version of data this software supports.
  const dataVersion = manifestJson.versions[DATA_VERSION];
  if (dataVersion == null) {
    throw new Error(`This data server does not provide "${DATA_VERSION}" data (${DATA_MANIFEST_URL})`);
  }

  // Download the latest data, if that fails download the backup data.
  // This is to account for the cases where following a git commit, the server
  // has deployed the new version of "latest.json" but not the new zip file yet.
  await prepareEmptyFolder(DATA_TEMP_LOCATION);
  let date;
  try {
    date = extractZipFileNameFromUrl(dataVersion.latest);
    await downloadZip(dataVersion.latest, DATA_TEMP_LOCATION_ZIP);
  }
  catch {
    try {
      date = extractZipFileNameFromUrl(dataVersion.backup);
      await downloadZip(dataVersion.backup, DATA_TEMP_LOCATION_ZIP);
    }
    catch {
      throw new Error(`Neither "${dataVersion.latest}" or backup option "${dataVersion.backup}" could be downloaded`);
    }
  }

  // After downloading the zip, extract its contents.
  try {
    await extract(DATA_TEMP_LOCATION_ZIP, { dir: resolve(DATA_TEMP_LOCATION) });
  }
  catch {
    throw new Error(`Failed to extract zip file`);
  }

  // Read the files in the data zip archive, and return the parsed network and
  // timetable data.
  let data = await readData(DATA_TEMP_LOCATION, date);

  // All finished with the files, so delete them.
  await deleteDir(DATA_TEMP_LOCATION, { recursive: true });

  return data;
}

/**
 * Ensure there is an empty folder at the given path, overwriting any existing
 * folder that was there.
 * @param path The folder path.
*/
async function prepareEmptyFolder(path: string) {
  const shouldDelete = existsSync(path);
  if (shouldDelete) {
    await deleteDir(path, { recursive: true });
  }
  await createDir(path, { recursive: true });
}

/**
 * Downloads a zip file from the given url. Throws an error if the path is not a
 * zip file.
 * @param path The URL for the zip file on the server.
 * @param destination The path for the downloaded zip file to take.
 */
async function downloadZip(path: string, destination: string) {
  if ((await got.get(path)).headers["content-type"] == "application/zip") {
    const stream = got.stream(path);
    await pipelineAsync(stream, createWriteStream(destination));
  }
  else {
    throw new Error(`"${path}" was not a zip file`);
  }
}

/**
 * Returns just the name of the zip file from a url, e.g. for
 * "https://data.trainarrives.in/data/2022-04-30.zip" returns just "2022-04-30".
 * @param url The url of the zip file.
 */
function extractZipFileNameFromUrl(url: string) {
  return basename(new URL(url).pathname).replace(".zip", "");
}
