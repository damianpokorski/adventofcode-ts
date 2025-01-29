import '../utils';
import { Grid, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const map = Grid.fromStrings(input);
  const treesOnPath = (move: Vector) => {
    let position = Vector.Zero;
    let trees = 0;
    while (position.y < map.array.length) {
      position = position.add(move);
      position.x = position.x % map.array[0].length;
      console.log(position.toString());
      trees += position.getGridValue(map.array) == '#' ? 1 : 0;
    }
    return trees;
  };

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
