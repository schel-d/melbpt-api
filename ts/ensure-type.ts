export function ensureNumber(input: any, forWhat: string): number {
  if (Number.isFinite(input)) {
    return input;
  }
  else {
    throw new Error(`Expecting a number, not "${input}", for ${forWhat}.`);
  }
}

export function ensureInteger(input: any, forWhat: string): number {
  if (Number.isInteger(input)) {
    return input;
  }
  else {
    throw new Error(`Expecting a integer, not "${input}", for ${forWhat}.`);
  }
}

export function ensureString(input: any, forWhat: string): string {
  if (typeof input === "string") {
    return input;
  }
  else {
    throw new Error(`Expecting a string, not "${input}", for ${forWhat}.`);
  }
}

export function ensureBoolean(input: any, forWhat: string): boolean {
  if (typeof input === "boolean") {
    return input;
  }
  else {
    throw new Error(`Expecting a boolean, not "${input}", for ${forWhat}.`);
  }
}

export function ensureArray(input: any, forWhat: string): any[] {
  if (Array.isArray(input)) {
    return input;
  }
  else {
    throw new Error(`Expecting an array, not "${input}", for ${forWhat}.`);
  }
}

export function ensureNumberArray(input: any, forWhat: string): number[] {
  ensureArray(input, forWhat).forEach(x => ensureNumber(x, forWhat));
  return input;
}

export function ensureIntegerArray(input: any, forWhat: string): number[] {
  ensureArray(input, forWhat).forEach(x => ensureInteger(x, forWhat));
  return input;
}

export function ensureStringArray(input: any, forWhat: string): string[] {
  ensureArray(input, forWhat).forEach(x => ensureString(x, forWhat));
  return input;
}

export function ensureBooleanArray(input: any, forWhat: string): boolean[] {
  ensureArray(input, forWhat).forEach(x => ensureBoolean(x, forWhat));
  return input;
}
