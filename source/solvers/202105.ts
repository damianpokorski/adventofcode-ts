import '../utils';
import { Grid, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Parse input into tuples of vectors
  const lines = input.map((line) => {
    const [x1, y1, x2, y2] = line
      .replace(' -> ', ',')
      .split(',')
      .map((number) => parseInt(number, 10));
    return [new Vector(x1, y1), new Vector(x2, y2)] as [Vector, Vector];
  });

  // Create grid
  const grid = Grid.createAndFill(
    Math.max(...lines.flatMap(([a, b]) => [a.x, b.x])) + 1,
    Math.max(...lines.flatMap(([a, b]) => [a.y, b.y])) + 1,
    () => 0 as number
  );
  for (const [start, end] of lines) {
    const path = end.subtract(start);
    const steps = path.isOrthogonal()
      ? path.gridDistance(Vector.Zero)
      : Math.abs(path.x);
    const step = path.divide(new Vector(steps, steps));

    // Verticals and horizontals only for part 1
    if (part == 1 && path.isOrthogonal() == false) {
      continue;
    }

    // Add up touched cells in grid
    for (let i = 0; i <= steps; i++) {
      const point = start.add(step.multiply(new Vector(i, i)));
      grid.array[point.y][point.x] += 1;
    }
  }

  return grid.filter((v) => v >= 2).length;
}).tests(
  `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`.split('\n'),
  5,
  12
);
