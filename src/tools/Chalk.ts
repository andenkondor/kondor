/* eslint-disable */
// @ts-nocheck
import chalk from "chalk";

export class Chalk {
  static print(content: string, color: string) {
    if (typeof chalk[color] !== "function") {
      throw new Error(`${color} is not a valid chalk color`);
    }

    return chalk[color](content);
  }
}
