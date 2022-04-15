import express from "express";
import { fetchData } from "./fetch-data";

export async function main() {
  const app = express();
  const port = process.env.PORT ?? 3000;

  await fetchData();

  app.get('/', (_, res) => {
    res.json({ "status": "online" });
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
