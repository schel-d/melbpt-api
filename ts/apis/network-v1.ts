import { Network } from "../network/network";

/**
 * The format of the response from this API. Fields can be added here, but any
 * other changes (modifications or removals) should instead be implemented as
 * a consecutive version of the API.
 */
type NetworkApiV1Schema = {
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
    directions: {
      id: string,
      name: string,
      stops: number[]
    }[]
  }[]
}

/**
 * API that provides data about the stops and lines in the network. Importantly,
 * this API also includes a date, which will be used to inform the client
 * whether it needs to update its cached network information when it calls
 * future APIs (which will all also provide the network date).
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
      return {
        id: l.id,
        name: l.name,
        color: l.color,
        service: l.service,
        routeType: l.route.type,
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