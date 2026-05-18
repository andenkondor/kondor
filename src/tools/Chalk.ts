import chalk from "chalk";

const RGB_PATTERN = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

export class Chalk {
  private static readonly colorCache = new Map<
    string,
    (text: string) => string
  >();

  static print(content: string, color: string): string {
    if (color === "none") {
      return content;
    }

    let formatter = this.colorCache.get(color);
    if (!formatter) {
      const match = color.match(RGB_PATTERN);
      if (!match) {
        throw new Error(`${color} is not a valid rgb color string`);
      }

      const [, r, g, b] = match.map(Number);
      if (
        r == null ||
        g == null ||
        b == null ||
        r < 0 ||
        r > 255 ||
        g < 0 ||
        g > 255 ||
        b < 0 ||
        b > 255
      ) {
        throw new Error(`${color} is not a valid rgb color string`);
      }

      formatter = chalk.rgb(r, g, b);
      this.colorCache.set(color, formatter);
    }

    return formatter(content);
  }
}
