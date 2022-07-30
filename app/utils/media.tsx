/* eslint-disable no-bitwise */
export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type LogoSize = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';
export type StillSize = 'w92' | 'w185' | 'w300' | 'original';

/* TMDB is a class that has two static methods, posterUrl and backdropUrl, that return a string. */
export default class TMDB {
  static readonly media_base_url = 'https://image.tmdb.org/t/p/';

  static posterUrl = (path: string, size?: PosterSize): string => {
    if (size) {
      return `${this.media_base_url}${size}/${path}`;
    }
    return `${this.media_base_url}original/${path}`;
  };

  static backdropUrl = (path: string, size?: BackdropSize): string => {
    if (size) {
      return `${this.media_base_url}${size}/${path}`;
    }
    return `${this.media_base_url}${size}/${path}`;
  };
}

/**
 * It takes a color in hex format and an amount, and returns a new color in hex format that is the
 * original color with the amount added to each of its red, green, and blue components
 * @param {string} color - The color you want to change.
 * @param {number} amount - The amount to change the color by.
 * @returns A function that takes two arguments, color and amount.
 */
export const changeColor = (color: string, amount: number) => {
  // #FFF not supportet rather use #FFFFFF
  const clamp = (val: number) => Math.min(Math.max(val, 0), 0xff);
  const fill = (str: string) => `00${str}`.slice(-2);

  const num = parseInt(color?.substring(1), 16);
  const red = clamp((num >> 16) + amount);
  const green = clamp(((num >> 8) & 0x00ff) + amount);
  const blue = clamp((num & 0x0000ff) + amount);
  return `#${fill(red.toString(16))}${fill(green.toString(16))}${fill(blue.toString(16))}`;
};
