import { StopID } from "./id";

export type LoopDirectionID = "loop-up-direct" | "loop-down-direct"
  | "loop-up-via-loop" | "loop-down-via-loop"

export type CityLoopPortal = "richmond" | "jolimont" | "north-melbourne"
export type CityLoopDirection = "clockwise" | "anticlockwise"

const PARLIAMENT: StopID = 1155;
const MELBOURNE_CENTRAL: StopID = 1120;
const FLAGSTAFF: StopID = 1068;
const SOUTHERN_CROSS: StopID = 1181;
const FLINDERS_STREET: StopID = 1071;
const RICHMOND: StopID = 1162;
const JOLIMONT: StopID = 1104;
const NORTH_MELBOURNE: StopID = 1144;
