/**
 * Random seed
 */
let randomSeed = Math.ceil(Date.now() * Math.random());

/**
 * Counter
 */
let counter = 0;

/**
 * Generates a unique ID based on the current timestamp
 */
export function generateUniqueId(length = 7): string {
  // Generate pseudo-random based on current timestamp
  let msAsBase = randomSeed % Math.pow(36, length);

  // If milliseconds are less than 100, invert to ensure at least 3 digits
  if (msAsBase < Math.pow(36, length - 1)) {
    msAsBase = Math.pow(36, length - 1) - msAsBase;
  }

  counter++;

  return (msAsBase + counter).toString(36);
}
