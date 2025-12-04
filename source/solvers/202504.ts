import '../utils';
import { Grid } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const grid = new Grid(input.map((line) => line.split('')));

  let totalMoved = 0;
  while (true) {
    // Find all of the locations with Paper @, which have less than 4 adjacent
    const moveable = grid
      .asVectors()
      .filter(
        ([vector, value]) =>
          value == '@' &&
          grid.getAdjacent(vector.x, vector.y).filter((x) => x == '@').length <
            4
      )
      .map(([vector, _]) => vector);

    // Tally up total items moved
    totalMoved += moveable.length;

    // Update grid - remove paper
    for (const { x, y } of moveable) {
      grid.set(x, y, '.');
    }

    // If there's nothing else that can be moved (or part 1)
    if (moveable.length == 0 || part == 1) {
      break;
    }
  }
  return totalMoved;
}).tests(
  `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`.split('\n'),
  13,
  43
);
