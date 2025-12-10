import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Process input, get rid of pesky displicate whitespaces
  const data = input.map((line) =>
    line.replaceAll(/\s+/g, ' ').trim().split(' ').asNumbers()
  );

  // Part 2: Read in column of 3s rather than horizontally row by row
  const transposed = [] as number[][];
  for (let i = 0; i < input.length; i++) {
    if (i % 3 == 0) {
      transposed.push([data[i][0], data[i + 1][0], data[i + 2][0]]);
      transposed.push([data[i][1], data[i + 1][1], data[i + 2][1]]);
      transposed.push([data[i][2], data[i + 1][2], data[i + 2][2]]);
    }
  }

  return (part == 1 ? data : transposed).filter(
    ([a, b, c]) => a + b > c && b + c > a && a + c > b
  ).length;
}).tests(
  `5 10 25
16 10 25
20 15 30`.split('\n'),
  2,
  3
);
