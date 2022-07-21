import express from "express";

/**
 * Serves the result of {@link apiFunction} at the given {@link path} on the web
 * server.
 * @param app The express web server.
 * @param path The path of the API, e.g. "/network/v1".
 * @param apiFunction Builds the object that will be converted to JSON and
 * served.
 */
export function serveApi(app: express.Application, path: string, apiFunction: () => any) {
  app.get(path, (_, res: express.Response) => {
    res.json(apiFunction());
  });
}
