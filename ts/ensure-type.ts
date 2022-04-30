/**
 * Throws an error if the input is not a (finite) number, otherwise returns the
 * value.
 * @param input The value to check.
 * @param forWhat Finishes the sentence "for ..." explaining what this value represents. Used for the error message.
 */
export function ensureNumber(input: any, forWhat: string): number {
  if (Number.isFinite(input)) {
    return input;
  }
  else {
    throw new Error(`Expecting a number, not "${input}", for ${forWhat}.`);
  }
}

/**
 * Throws an error if the input is not an integer, otherwise returns the value.
 * @param input The value to check.
 * @param forWhat Finishes the sentence "for ..." explaining what this value represents. Used for the error message.
 */
export function ensureInteger(input: any, forWhat: string): number {
  if (Number.isInteger(input)) {
    return input;
  }
  else {
    throw new Error(`Expecting a integer, not "${input}", for ${forWhat}.`);
  }
}

/**
 * Throws an error if the input is not a string, otherwise returns the value.
 * @param input The value to check.
 * @param forWhat Finishes the sentence "for ..." explaining what this value represents. Used for the error message.
 */
export function ensureString(input: any, forWhat: string): string {
  if (typeof input === "string") {
    return input;
  }
  else {
    throw new Error(`Expecting a string, not "${input}", for ${forWhat}.`);
  }
}

/**
 * Throws an error if the input is not a boolean value, otherwise returns the
 * value.
 * @param input The value to check.
 * @param forWhat Finishes the sentence "for ..." explaining what this value represents. Used for the error message.
 */
export function ensureBoolean(input: any, forWhat: string): boolean {
  if (typeof input === "boolean") {
    return input;
  }
  else {
    throw new Error(`Expecting a boolean, not "${input}", for ${forWhat}.`);
  }
}

/**
 * Throws an error if the input is not an array, otherwise returns the array.
 * @param input The value to check.
 * @param forWhat Finishes the sentence "for ..." explaining what this value represents. Used for the error message.
 */
export function ensureArray(input: any, forWhat: string): any[] {
  if (Array.isArray(input)) {
    return input;
  }
  else {
    throw new Error(`Expecting an array, not "${input}", for ${forWhat}.`);
  }
}

/**
 * Throws an error if the input is not an array of numbers, otherwise returns
 * the array.
 * @param input The value to check.
 * @param forWhat Finishes the sentence "for ..." explaining what this value represents. Used for the error message.
 */
export function ensureNumberArray(input: any, forWhat: string): number[] {
  ensureArray(input, forWhat).forEach(x => ensureNumber(x, forWhat));
  return input;
}

/**
 * Throws an error if the input is not an array of integers, otherwise returns
 * the array.
 * @param input The value to check.
 * @param forWhat Finishes the sentence "for ..." explaining what this value represents. Used for the error message.
 */
export function ensureIntegerArray(input: any, forWhat: string): number[] {
  ensureArray(input, forWhat).forEach(x => ensureInteger(x, forWhat));
  return input;
}

/**
 * Throws an error if the input is not an array of strings, otherwise returns
 * the array.
 * @param input The value to check.
 * @param forWhat Finishes the sentence "for ..." explaining what this value represents. Used for the error message.
 */
export function ensureStringArray(input: any, forWhat: string): string[] {
  ensureArray(input, forWhat).forEach(x => ensureString(x, forWhat));
  return input;
}

/**
 * Throws an error if the input is not an array of boolean values, otherwise
 * returns the array.
 * @param input The value to check.
 * @param forWhat Finishes the sentence "for ..." explaining what this value represents. Used for the error message.
 */
export function ensureBooleanArray(input: any, forWhat: string): boolean[] {
  ensureArray(input, forWhat).forEach(x => ensureBoolean(x, forWhat));
  return input;
}
