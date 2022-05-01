import express from "express";
import { fetchData } from "./read-data/fetch-data";

/**
 * The main entry point for the server.
 */
export async function main() {
  console.log("Starting...");

  const app = express();
  const port = process.env.PORT ?? 3000;

  let data = await fetchData();
  let network = data.network;

  console.log(`Read in ${network.stops.count()} stops.`);

  app.get('/', (_, res) => {
    res.json({ "status": "online" });
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
  });
}
