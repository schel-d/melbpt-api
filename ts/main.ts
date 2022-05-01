import express from "express";
import { indexApi } from "./apis";
import { networkApiV1 } from "./apis/network-v1";
import { Network } from "./network/network";
import { Stop } from "./network/stop";
import { fetchData } from "./read-data/fetch-data";
import { serveApi } from "./utils";

/**
 * The main entry point for the server.
 */
export async function main() {
  console.log("Starting...");

  const app = express();
  const port = process.env.PORT ?? 3000;

  let data = await fetchData();
  let network = data.network;

  serveApi(app, "/", () => indexApi());
  serveApi(app, "/network/v1", () => networkApiV1(network));

  app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
  });
}


// temp
export async function printStopIds(stops: string[]) {
  let data = await fetchData();
  let network = data.network;

  console.log(stops.map(n => (network.stops.values().find(s => s.urlName === n) as Stop).id))
}
