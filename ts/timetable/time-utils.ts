/**
 * The official time zone name for Melbourne as used by Luxon.
 */
export const MelbTimeZone = "Australia/Melbourne";

/**
 * Represents which days of the week a timetable entry runs on.
 */
export type WeekDayRange = {
  mon: boolean,
  tue: boolean,
  wed: boolean,
  thu: boolean,
  fri: boolean,
  sat: boolean,
  sun: boolean,
}
