import '../utils';
import { Grid, memoize, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const grid = new Grid(input.map((line) => line.split('')));

  // Place initial beam from starting point
  const start = grid.findLocationOf((cell) => cell == 'S')!.add(Vector.Down);
  grid.set(start.x, start.y, '|');

  // Part 1 - Beam splitting
  if (part == 1) {
    let activeSplitters = 0;
    for (let y = 1; y < grid.array.length; y++) {
      for (let x = 0; x < grid.array[y].length; x++) {
        // Continue beams from previous rows first
        if (grid.get(x, y) == '.' && grid.get(x, y - 1) == '|') {
          grid.set(x, y, '|');
        }

        // Split
        if (grid.get(x, y) == '^' && grid.get(x, y - 1) == '|') {
          grid.set(x - 1, y, '|');
          grid.set(x + 1, y, '|');
          // Tally up splitters
          activeSplitters++;
        }
      }
    }
    return activeSplitters;
  }

  // Part 2 - Memoized traversing, keeping track of previous possibilities through cheeky recursion
  const timelines = memoize(
    (v: Vector): number => {
      // Reached the bottom
      if (v.add(Vector.Down).getGridValue(grid.array) == undefined) {
        return 1;
      }

      // Split or continue downwards
      return grid.get(v.x, v.y) == '^'
        ? timelines(v.add(Vector.Left)) + timelines(v.add(Vector.Right))
        : timelines(v.add(Vector.Down));
    },
    (v) => v.hash().toString()
  );
  return timelines(start);
}).tests(
  `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`.split('\n'),
  21,
  40
);
