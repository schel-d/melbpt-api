import { PlatformID } from "./id";

/**
 * Represents a particular platform at a particular stop. Contains information
 * like its name and rules that define which trains stop there.
 */
export class Platform {
  /**
   * The unique identifier for this platform. Is only unique for this stop (i.e.
   * all stops will likely have a platform with an ID of 1).
   */
  id: PlatformID;

  /**
   * The name of this platform, which should include the word "platform", e.g.
   * "Platform 1".
   */
  name: string;

  /**
   * A list of rules that determine which trains use this platform. Used to
   * guess platforms for each service, since I can't find timetables containing
   * this information, and at most stations it's pretty predictable anyway.
   */
  rules: string[];

  /**
   * Creates a new platform. Should only really be called while reading in data
   * from the data server.
   * @param id See {@link Platform.id}
   * @param name See {@link Platform.name}
   * @param rules See {@link Platform.rules}
   */
  constructor(id: PlatformID, name: string, rules: string[]) {
    this.id = id;
    this.name = name;
    this.rules = rules;
  }
}
