/**
 * Throw an exception if any parameters ({@link args}) given are null.
 * @param args Values which are potentially null.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function requireNonNull(...args: any) {
  for (const arg of args) {
    if (arg == null) {
      throw new Error("Cannot be null/undefined");
    }
  }
}
