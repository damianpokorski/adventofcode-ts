import '../utils';
import { Grid, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Import data
  const map = Grid.fromStrings(input);

  // Calculate encountered trees on the way
  const treesOnPath = (move: Vector) => {
    let position = Vector.Zero;
    let trees = 0;
    while (position.y < map.array.length) {
      position = position.add(move);
      position.x = position.x % map.array[0].length;
      trees += position.getGridValue(map.array) == '#' ? 1 : 0;
    }
    return trees;
  };
  // Part 1 - specific path, Part 2 - multiplication result of
  return (
    part == 1
      ? [new Vector(3, 1)]
      : [new Vector(1, 1), new Vector(3, 1), new Vector(5, 1), new Vector(7, 1), new Vector(1, 2)]
  )
    .map((step) => treesOnPath(step))
    .reduce((a, b) => a * b, 1);
}).tests(
  `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`.split('\n'),
  7,
  336
);
