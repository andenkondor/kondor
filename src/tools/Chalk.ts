import chalk from "chalk";

const RGB_PATTERN = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

export class Chalk {
  static print(content: string, color: string): string {
    if (color === "none") {
      return content;
    }

    const match = color.match(RGB_PATTERN);
    if (!match) {
      throw new Error(`${color} is not a valid rgb color string`);
    }

    const [, r, g, b] = match.map(Number);
    return chalk.rgb(r!, g!, b!)(content);
  }
}
