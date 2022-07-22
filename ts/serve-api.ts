import express from "express";

/**
 * Serves the result of {@link apiFunction} at the given {@link path} on the web
 * server.
 * @param app The express web server.
 * @param path The path of the API, e.g. "/network/v1".
 * @param apiFunction Builds the object that will be converted to JSON and
 * served.
 */
export function serveApi(app: express.Application, path: string,
  apiFunction: (params: unknown) => any) {

  app.get(path, (req, res: express.Response) => {
    try {
      const json = apiFunction(req.query);
      res.json(json);
    }
    catch (ex) {
      if (isMissingParamError(ex) || isInvalidParamError(ex)) {
        res.status(400).set("Content-Type", "text/plain").send(ex.message);
      }
      else {
        res.sendStatus(500);
      }
    }
  });
}

/**
 * Returns the query param with the given name from the params object passed to
 * each API function. Returns null if the param wasn't part of the request.
 * @param params The params object passed to each API function.
 * @param name The name of the parameter to retrieve.
 */
export function retrieveParam(params: unknown, name: string): string | null {
  return (params as any)[name] ?? null;
}

/**
 * Returns the query param with the given name from the params object passed to
 * each API function. Throws a {@link MissingParamError} if the param wasn't part of
 * the request.
 * @param params The params object passed to each API function.
 * @param name The name of the parameter to retrieve.
 */
export function retrieveRequiredParam(params: unknown, name: string): string {
  const param = retrieveParam(params, name);
  if (param == null) { throw new MissingParamError(name); }
  return param;
}

/**
 * Represents an error that is not the fault of the server, but rather has been
 * caused by the API consumer forgetting a required parameter in the request.
 */
export class MissingParamError extends Error {
  /**
   * The name of the missing parameter.
   */
  readonly missingParamName: string;

  /**
   * Creates a {@link MissingParamError}.
   * @param missingParamName The name of the missing parameter.
   */
  constructor(missingParamName: string) {
    super(`The "${missingParamName}" parameter was missing from the request.`);
    this.missingParamName = missingParamName;
  }
}

/**
 * Returns true if the passed {@link err} value is a {@link MissingParamError}.
 * @param err The value to check.
 */
export function isMissingParamError(err: unknown): err is MissingParamError {
  return (err as any).missingParamName != null;
}

/**
 * Represents an error that is not the fault of the server, but rather has been
 * caused by the API consumer submitting an invalid value for one of the
 * parameters in the request.
 */
export class InvalidParamError extends Error {
  /**
   * Gives this error a unique field to identify it later (because JS has no
   * types).
   */
  readonly isInvalidParamError = true;

  /**
   * Creates a {@link InvalidParamError}.
   * @param message The error message to display to the API consumer.
   */
  constructor(message: string) {
    super(message);
  }
}

/**
 * Returns true if the passed {@link err} value is a {@link InvalidParamError}.
 * @param err The value to check.
 */
export function isInvalidParamError(err: unknown): err is InvalidParamError {
  return (err as any).isInvalidParamError == true;
}
