import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return input
    .map((line) => line.split('x').fromStringToNumberArray())
    .map(([l, w, h]) => {
      // Wrapping paper
      if (part == 1) {
        const surfaces = [l * w, w * h, h * l];
        return Math.min(...surfaces) + surfaces.map((surface) => surface * 2).sum();
      }
      // Decorations
      const ribbon =
        [l, w, h]
          .sort((a, b) => a - b)
          .slice(0, 2)
          .sum() * 2;
      const bow = l * w * h;
      return ribbon + bow;
    })
    .sum();
}).tests(`2x3x4`.split('\n'), 58, 34);
