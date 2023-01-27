declare module 'colorthief' {
  export type RGBColor = [number, number, number];
  const ColorThief: {
    getColor(imageURL: string, quality?: number): RGBColor;
    getPalette(URL: string, colorCount?: number, quality?: number): RGBColor[];
  };
  export default ColorThief;
}
