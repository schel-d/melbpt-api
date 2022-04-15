import express from "express";

export function main() {
  const app = express();
  const port = process.env.PORT ?? 3000;

  app.get('/', (_, res) => {
    res.json({ "status": "online" });
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
