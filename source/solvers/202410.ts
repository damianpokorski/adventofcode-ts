import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const grid = input.map((row) => row.split('').map((height) => parseInt(height, 10) ?? 0));
  const vGrid = input
    .map((row, y) => row.split('').map((_, x) => new Vector(x, y)))
    .reduce((a, b) => [...a, ...b], []);

  const trailheads = vGrid.filter((vector) => vector.getGridValue(grid) == 0);

  const scores = [] as number[];
  for (const trailhead of trailheads) {
    const current = trailhead.copy();

    // Heads of where the paths are
    const paths = [[current]];
    // While we have paths or
    while (
      paths.length > 0 &&
      paths.every((path) => path[path.length - 1].getGridValue(grid) == 9) == false
    ) {
      // Grab most recent path
      const path = paths.shift();
      if (!path) {
        continue;
      }

      const head = path[path.length - 1];
      for (const adjecent of [
        head.add(Vector.Up),
        head.add(Vector.Right),
        head.add(Vector.Down),
        head.add(Vector.Left)
      ]) {
        const currentHeight = head.getGridValue(grid);
        const nextheight = adjecent.getGridValue(grid);
        const validNext =
          currentHeight !== undefined && nextheight !== undefined && currentHeight + 1 == nextheight;
        // We continue the path!
        if (validNext) {
          paths.push([...path, adjecent]);
        }
      }
    }

    const score = paths.map((x) => (part == 1 ? x[x.length - 1] : x).toString()).distinct().length;
    scores.push(score);
  }

  return scores.sum();
})
  .test(
    1,
    `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`.split('\n'),
    36
  )
  .test(
    2,
    `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`.split('\n'),
    81
  );
