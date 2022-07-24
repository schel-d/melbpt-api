import express from "express";
import cors from "cors";
import { indexApi } from "./apis";
import { networkApiV1 } from "./apis/network-v1";
import { fetchData } from "./read-data/fetch-data";
import { Settings } from "luxon";
import { serviceApiV1 } from "./apis/service-v1";
import { serveApi } from "./serve-api";
import { departuresApiV1 } from "./apis/departures-v1";

/**
 * How often (in milliseconds) to re-download the data from the data server.
 * Currently set to the value of every 30 minutes.
 */
const dataRefreshIntervalMs = 30 * 60 * 1000;

/**
 * The main entry point for the server.
 */
export async function main() {
  // Set up luxon to use UTC by default.
  Settings.defaultZone = "utc";

  console.log("Starting...");

  const app = express();
  const port = process.env.PORT ?? 3000;

  app.use(cors());
  app.use(express.static("other"));

  // Todo: validate the data after parsing it (e.g. check the platform rules
  // are valid, stop adjacent lists match up with each other, etc.)
  let data = await fetchData();
  let network = data.network;
  let timetables = data.timetables;
  console.log(`Downloaded data (network hash="${data.network.hash}").`);

  // Every 30 minutes re-download the data from the data server to stay up to
  // date. If an error occurs, continue using the previous version of the data,
  // and try again in another 30 minutes.
  setInterval(async () => {
    try {
      // Todo: validate the data after parsing it (e.g. check the platform rules
      // are valid, stop adjacent lists match up with each other, etc.)
      data = await fetchData();
      network = data.network;
      timetables = data.timetables;
      console.log(`Refreshed data (network hash="${data.network.hash}").`);
    }
    catch (ex) {
      // If an error occurs, just log it. The data variable will still contain
      // the old data, so no need to touch it.
      console.log(`Error refreshing data (will continue using old data).`, ex);
    }
  }, dataRefreshIntervalMs);


  serveApi(app, "/", () => indexApi());
  serveApi(app, "/network/v1", () => networkApiV1(network));
  serveApi(app, "/service/v1", (p) => serviceApiV1(p, network, timetables));
  serveApi(app, "/departures/v1", (p) => departuresApiV1(p, network, timetables));

  app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
  });
}
