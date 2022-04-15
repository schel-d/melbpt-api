import extract from "extract-zip";
import { createWriteStream, existsSync, mkdir, rm } from "fs";
import got from "got";
import { dirname, resolve } from "path";
import { pipeline, PipelineSource } from "stream";
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

export async function fetchData() {
  let data: LatestJsonType;
  try {
    data = await got.get(DATA_URL).json() as LatestJsonType;
  }
  catch {
    throw `There was not a json file at "${DATA_URL}"`;
  }

  const dataVersion = data.versions[DATA_VERSION];
  if (dataVersion == null) {
    throw `This data server does not provide "${DATA_VERSION}" data (${DATA_URL})`;
  }

  await prepareEmptyFolder(dirname(DATA_TEMP_LOCATION));

  // Download the latest data, if that fails download the backup data.
  // This is to account for the case that following a git commit, the server
  // has deployed the new version of "latest.json" but not the new zip file yet.
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

  await extract(DATA_TEMP_LOCATION, { dir: resolve(dirname(DATA_TEMP_LOCATION)) });
}

const deleteDir = promisify(rm);
const createDir = promisify(mkdir);
async function prepareEmptyFolder(path: string) {
  const shouldDelete = existsSync(path);
  if (shouldDelete) {
    await deleteDir(path, { recursive: true });
  }
  await createDir(path, { recursive: true });
}

const pipelineAsync = promisify(pipeline);
async function downloadZip(path: string, destination: string) {
  if ((await got.get(path)).headers["content-type"] == "application/zip") {
    const stream = got.stream(path);
    await pipelineAsync(stream, createWriteStream(destination));
  }
  else {
    throw `"${path}" was not a zip file`;
  }
}
