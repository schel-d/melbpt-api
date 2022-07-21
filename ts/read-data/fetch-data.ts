import extract from "extract-zip";
import { createWriteStream, existsSync, mkdir, rm } from "fs";
import got from "got";
import { basename, resolve } from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { z } from "zod";
import { Data, readData } from "./read-data";

/**
 * Where to find the manifest file on the data server telling this program which
 * zip file to download.
 */
const manifestUrl = "https://data.trainquery.com/latest.json";

/**
 * Which version of the data this program support, as the manifest file may have
 * data available in multiple formats.
 */
const supportedVersion = "v2";

/**
 * The directory where the extracted zip contents will live while they are being
 * read and parsed.
 */
const tempDownloadFolder = "./.out/.data";

/**
 * Where to download the zip file downloaded from the data server to.
 */
const tempDownloadZipName = tempDownloadFolder + "/data.zip";

const ManifestJson = z.object({
  versions: z.record(z.object({
    latest: z.string().url(),
    backup: z.string().url()
  }))
});
type ManifestJson = z.infer<typeof ManifestJson>;

const deleteDir = promisify(rm);
const createDir = promisify(mkdir);
const pipelineAsync = promisify(pipeline);

/**
 * Download the stop, line, and timetable data from the data server
 * (probably https://data.trainquery.com).
 */
export async function fetchData(): Promise<Data> {
  // Download the json type that indicates where the latest data can be found.
  const manifestJson = await downloadManifest(manifestUrl);

  // Get the url for the version of data this software supports.
  const dataVersion = manifestJson.versions[supportedVersion];
  if (dataVersion == null) {
    throw badVersionErr(supportedVersion, manifestUrl);
  }

  // Download the latest data, if that fails download the backup data.
  // This is to account for the cases where following a git commit, the server
  // has deployed the new version of "latest.json" but not the new zip file yet.
  await prepareEmptyFolder(tempDownloadFolder);
  const url = await downloadZipOrBackup(
    dataVersion.latest, dataVersion.backup, tempDownloadZipName
  );

  // After downloading the zip, extract its contents.
  try {
    await extract(tempDownloadZipName, { dir: resolve(tempDownloadFolder) });
  }
  catch {
    throw extractZipFailed();
  }

  // Read the files in the data zip archive, and return the parsed network and
  // timetable data.
  const hash = extractZipFileNameFromUrl(url);
  const data = await readData(tempDownloadFolder, hash);

  // All finished with the files, so delete them.
  await deleteDir(tempDownloadFolder, { recursive: true });

  return data;
}

/**
 * Returns the data in the manifest, after downloading it and parsing it to
 * ensure it is in an understood format. Throws errors if there's not a json
 * file at the given url, or the json file there is in an unexpected format.
 * @param url The url of the manifest json file.
 */
async function downloadManifest(url: string): Promise<ManifestJson> {
  try {
    const json = await got.get(url).json();
    try {
      return ManifestJson.parse(json);
    }
    catch {
      throw badManifestFormat(url);
    }
  }
  catch {
    throw badManifestUrl(url);
  }
}

/**
 * Attempts to download the zip file at the primary url, and if that fails,
 * tries the backup zip file. Returns the url of the zip file that was
 * successfully downloaded. Throws an error if neither could be downloaded.
 * @param primary The first zip url to try.
 * @param backup The second zip url to try.
 */
async function downloadZipOrBackup(primary: string, backup: string,
  where: string): Promise<string> {

  try {
    await downloadZip(primary, where);
    return primary;
  }
  catch {
    try {
      await downloadZip(backup, where);
      return backup;
    }
    catch {
      throw downloadFailed(primary, backup);
    }
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
    throw expectedZipFile(path);
  }
}

/**
 * Returns just the name of the zip file from a url, e.g. for
 * "https://data.trainquery.com/data/2022-04-30.zip" returns just "2022-04-30".
 * @param url The url of the zip file.
 */
function extractZipFileNameFromUrl(url: string) {
  return basename(new URL(url).pathname).replace(".zip", "");
}

/**
 * This data server does not provide "`version`" data (`url`).
 */
const badVersionErr = (version: string, url: string) => new Error(
  `This data server does not provide "${version}" data (${url})`
);

/**
 * Neither "`primary`" or backup option "`backup`" could be downloaded.
 */
const downloadFailed = (primary: string, backup: string) => new Error(
  `Neither "${primary}" or backup option "${backup}" could be downloaded`
);

/**
 * Failed to extract zip file.
 */
const extractZipFailed = () => new Error(
  `Failed to extract zip file`
);

/**
 * There was not a json file at "`url`".
 */
const badManifestUrl = (url: string) => new Error(
  `There was not a json file at "${url}"`
);

/**
 * Json file at "`url`" was in an unexpected format.
 */
const badManifestFormat = (url: string) => new Error(
  `Json file at "${url}" was in an unexpected format`
);

/**
 * "`path`" was not a zip file.
 */
const expectedZipFile = (path: string) => new Error(
  `"${path}" was not a zip file`
);
