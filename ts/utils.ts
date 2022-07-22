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

/**
 * Parses an integer. Throws an error if the string given is not an integer (it
 * contains decimals, text, or illegal symbols).
 * @param value The string with the integer.
 */
export function parseIntThrow(value: string): number {
  if (value.includes(".")) { throw notAnInt(value); }
  const result = parseInt(value);
  if (isNaN(result)) { throw notAnInt(value); }
  return result;
}

/**
 * "`value`" is not an integer.
 */
const notAnInt = (value: string) => new Error(
  `"${value}" is not an integer.`
);
