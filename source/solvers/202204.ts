import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return input
    .map(
      (line) =>
        line
          .split(',')
          .flatMap((elf) => elf.split('-').fromStringToNumberArray()) as [
          number,
          number,
          number,
          number
        ]
    )
    .filter(([a, b, c, d]) => {
      // Part 1: Check if any shifts are entirely overlapped by one another
      if ((a >= c && b <= d) || (c >= a && d <= b)) {
        return true;
      }
      // Part 2: Check if any overlap at all
      if (part == 2) {
        const [minB, maxC] = [Math.min(b, d), Math.max(a, c)];
        return minB >= maxC;
      }
      return false;
    }).length;
}).tests(
  `2-4,6-8
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`.split('\n'),
  2,
  4
);
