import fetch from "node-fetch";

const DATA_URL = "https://data.trainarrives.in/latest.json";
const DATA_VERSION = "v1";
type LatestJsonType = {
  versions: {
    [version: string]: {
      latest: string,
      backup: string
    }
  }
}

export async function fetchData() {
  const response = await fetch(DATA_URL);
  const data = await response.json() as LatestJsonType;
  const dataVersion = data.versions[DATA_VERSION];

  if (dataVersion == null) {
    throw `This data server does not provide "${DATA_VERSION}" data (${DATA_URL})`;
  }

  console.log(dataVersion);
}
