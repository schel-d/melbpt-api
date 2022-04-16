import { LoopDirectionID } from "./city-loop";

/**
 * Represents the behaviour of this line, mostly around the directions that it
 * can travel in.
 */
export type LineRoute = "regular" | "city-loop"
export const LineRoutes = {
  list: ["regular", "city-loop"],
  parse: (input: string): LineRoute => {
    if (!LineRoutes.list.includes(input)) {
      throw `Invalid LineRoute "${input}"`;
    }
    return input as LineRoute;
  }
};

/**
 * Represents a color that a line can use.
 */
export type LineColor = "red" | "yellow" | "green" | "cyan" | "blue" | "purple"
  | "pink"

/**
 * Represents the type of service running on this line.
 */
export type LineService = "metro" | "regional"

/**
 * Represents a specific order of stops. Each line may run in multiple
 * directions.
 */
export type DirectionID = RegularDirectionID | LoopDirectionID

/**
 * Represents a less exact direction, simply whether this direction is towards
 * the city or not.
 */
export type GeneralDirectionID = "up" | "down"


export type RegularDirectionID = "regular-up" | "regular-down"
