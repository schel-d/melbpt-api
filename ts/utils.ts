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
