/**
 * The format of the response from this API. Fields can be added here, but
 * should NEVER be removed/modified.
 */
type IndexApiSchema = {
  status: "online" | "maintenence" | "abandoned" | "error"
}

/**
 * Essentially a "Hello world!" API that simply lets the client know the API is
 * online. This API is served from the index page
 * (https://api.trainarrives.in/), and so has no version.
 */
export function indexApi(): IndexApiSchema {
  return {
    status: "online"
  };
}
