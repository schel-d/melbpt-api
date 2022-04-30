/**
 * Represents the behaviour of this line, mostly around the directions that it
 * can travel in.
 */
export type LineRouteType = typeof LineRouteTypes[number]
/**
 * An array of all the possible route types a line can be.
 */
export const LineRouteTypes = ["linear", "city-loop", "branch"] as const;
/**
 * Throws an error if the given string is not a {@link LineRouteType}, otherwise
 * returns that string.
 * @param input The string representing the line route.
 */
export function parseLineRoute(input: string): LineRouteType {
  if (LineRouteTypes.includes(input as LineRouteType)) { return input as LineRouteType; }
  else { throw new Error(`Invalid LineRoute: "${input}"`); }
}

/**
 * Represents a color that a line can use.
 */
export type LineColor = typeof LineColors[number]
/**
 * An array of all the possible colors that a line can be.
 */
export const LineColors = [
  "red", "yellow", "green", "cyan", "blue", "purple", "pink"
] as const;
/**
 * Throws an error if the given string is not a {@link LineColor}, otherwise
 * returns that string.
 * @param input The string representing the line color.
 */
export function parseLineColor(input: string): LineColor {
  if (LineColors.includes(input as LineColor)) { return input as LineColor; }
  else { throw new Error(`Invalid LineColor: "${input}"`); }
}

/**
 * Represents the type of service that runs on this line.
 */
export type LineService = typeof LineServices[number]
/**
 * An array of all the possible types of service a line can be.
 */
export const LineServices = ["metro", "regional"] as const;
/**
 * Throws an error if the given string is not a {@link LineService}, otherwise
 * returns that string.
 * @param input The string representing the line service.
 */
export function parseLineService(input: string): LineService {
  if (LineServices.includes(input as LineService)) {
    return input as LineService;
  }
  else {
    throw new Error(`Invalid LineService: "${input}"`);
  }
}
