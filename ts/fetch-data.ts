import extract from "extract-zip";
import { createWriteStream, existsSync, mkdir, rm } from "fs";
import got from "got";
import { dirname, resolve } from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const DATA_URL = "https://data.trainarrives.in/latest.json";
const DATA_VERSION = "v1";
const DATA_TEMP_LOCATION = "./.out/.data/data.zip";
type LatestJsonType = {
  versions: {
    [version: string]: {
      latest: string,
      backup: string
    }
  }
}

const deleteDir = promisify(rm);
const createDir = promisify(mkdir);
const pipelineAsync = promisify(pipeline);

/**
 * Download the stop, line, and timetable data from the data server
 * (probably https://data.trainarrives.in).
 */
export async function fetchData() {
  // Download the json type that indicates where the latest data can be found.
  let data: LatestJsonType;
  try {
    data = await got.get(DATA_URL).json() as LatestJsonType;
  }
  catch {
    throw `There was not a json file at "${DATA_URL}"`;
  }

  // Get the url for the version of data this software supports.
  const dataVersion = data.versions[DATA_VERSION];
  if (dataVersion == null) {
    throw `This data server does not provide "${DATA_VERSION}" data (${DATA_URL})`;
  }

  // Download the latest data, if that fails download the backup data.
  // This is to account for the cases where following a git commit, the server
  // has deployed the new version of "latest.json" but not the new zip file yet.
  await prepareEmptyFolder(dirname(DATA_TEMP_LOCATION));
  try {
    await downloadZip(dataVersion.latest, DATA_TEMP_LOCATION);
  }
  catch {
    try {
      await downloadZip(dataVersion.backup, DATA_TEMP_LOCATION);
    }
    catch {
      throw `Neither "${dataVersion.latest}" or backup option "${dataVersion.backup}" could be downloaded`;
    }
  }

  // After downloading the zip, extract its contents.
  try {
    await extract(DATA_TEMP_LOCATION, { dir: resolve(dirname(DATA_TEMP_LOCATION)) });
  }
  catch {
    throw `Failed to extract zip file`;
  }


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
    throw `"${path}" was not a zip file`;
  }
}
