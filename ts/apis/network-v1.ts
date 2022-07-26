import { Network } from "../network/network";
import { CityLoopLineRoute } from "../network/routes/city-loop-line-route";

/**
 * The format of the response from this API. Fields can be added here, but any
 * other changes (modifications or removals) should instead be implemented as
 * a consecutive version of the API.
 */
export type NetworkApiV1Schema = {
  hash: string,
  stops: {
    id: number,
    name: string,
    platforms: {
      id: string,
      name: string
    }[],
    urlName: string
  }[],
  lines: {
    id: number,
    name: string,
    color: string,
    service: string,
    routeType: string,
    routeLoopPortal?: string,
    directions: {
      id: string,
      name: string,
      stops: number[]
    }[]
  }[]
}

/**
 * API that provides data about the stops and lines in the network. Importantly,
 * this API also includes hash value, which the client will send along when it
 * makes API requests in the future. When the client sends an out-of-date hash
 * to the other API's they will return the result of this API to the client in
 * the same response, saving the client having to call this API themselves and
 * the increased response time.
 * @param network The network information downloaded from the data server.
 */
export function networkApiV1(network: Network): NetworkApiV1Schema {
  return {
    hash: network.hash,
    stops: network.stops.values().map(s => {
      return {
        id: s.id,
        name: s.name,
        platforms: s.platforms.map(p => {
          return {
            id: p.id,
            name: p.name
          }
        }),
        urlName: s.urlName
      }
    }),
    lines: network.lines.values().map(l => {
      // If this is a city loop line, then include the portal. "undefined" is
      // used here over "null" so it will not appear in the json at all if it's
      // not a city loop line.
      const routeLoopPortal = l.route.type === "city-loop"
        ? (l.route as CityLoopLineRoute).portal
        : undefined;

      return {
        id: l.id,
        name: l.name,
        color: l.color,
        service: l.service,
        routeType: l.route.type,
        routeLoopPortal: routeLoopPortal,
        directions: l.directions.map(d => {
          return {
            id: d.id,
            name: d.name,
            stops: d.stops
          }
        })
      }
    })
  };
}
