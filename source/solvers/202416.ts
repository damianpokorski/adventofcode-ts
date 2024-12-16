import { PriorityQueue } from 'priority-queue-typescript';
import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const grid = input.map((row) => row.split(''));
  const getGridValue = (search: string) =>
    grid
      .map((row, y) => row.map((cell, x) => [new Vector(x, y), cell] as [Vector, string]))
      .flat()
      .filter(([_, cell]) => cell == search)
      .shift()?.[0] ?? Vector.Zero;

  const start = getGridValue('S');
  const end = getGridValue('E');

  // Utility structs - storing path & direction
  class Path {
    constructor(
      public score: number,
      public head: Vector,
      public facing: Vector
    ) {}
  }
  const hash = (path: Path) => (path.head.hash() << 8) + path.facing.hash();

  const q = new PriorityQueue<Path>(6400, function (a: Path, b: Path) {
    return a.score - b.score;
  });

  q.add(new Path(0, start, Vector.Right));
  const seen = new Set<number>();

  // Keep iterating on open paths
  while (q.size() > 0) {
    const path = q.poll() as Path;
    const { score, head, facing } = path;
    // Mark current spot as seen
    seen.add(hash(path));

    // We got to the end the most optimal way
    if (head.equals(end)) {
      return score;
    }

    // Add paths with appropiate costs
    // We can skip some iterations here by combining a turn with moving forwards into one - since one can't follow the other & two turns, means going back on itself
    for (const path of [
      new Path(score + 1001, head.add(facing.turnCounterClockwise()), facing.turnCounterClockwise()),
      new Path(score + 1, head.add(facing), facing),
      new Path(score + 1001, head.add(facing.turnClockwise()), facing.turnClockwise())
    ]) {
      // If we're not
      if (head.getGridValue(grid) == '#') {
        continue;
      }
      // If we've visited the spot skip i
      if (seen.has(hash(path))) {
        continue;
      }
      q.add(path);
    }
  }
  return -1;
}).test(
  1,
  `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`.split('\n'),
  11048
);
