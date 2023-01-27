/* eslint-disable import/prefer-default-export */

/**
 * It takes three numbers, converts them to hexadecimal, and returns a string.
 * @param {number} r - number - The red value of the color.
 * @param {number} g - number - The green value of the color.
 * @param {number} b - number - The blue value of the color.
 * @returns A function that takes three numbers and returns a string.
 */
const RGBToHex = (r: number, g: number, b: number): string => {
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');
  return `#${hexR}${hexG}${hexB}`.toUpperCase();
};

export { RGBToHex };
