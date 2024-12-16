import { PriorityQueue } from 'priority-queue-typescript';
import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const grid = input.map((row) => row.split(''));
  const getGridValue = (search: string) =>
    grid
      .map((row, y) =>
        row.map((cell, x) => ({
          v: new Vector(x, y),
          cell
        }))
      )
      .flat()
      .filter((cell) => cell.cell == search)
      .shift()?.v ?? Vector.Zero;

  const start = getGridValue('S');
  const end = getGridValue('E');

  // Utility structs - storing path & direction
  class Path {
    constructor(
      public score: number,
      public head: Vector,
      public facing: Vector,
      public route: Vector[]
    ) {}
  }

  // Generating a fast hash for direction/facing comparison
  const hash = (path: Path) => (path.head.hash() << 4) + path.facing.hash();

  const q = new PriorityQueue<Path>(6400, function (a: Path, b: Path) {
    return a.score - b.score;
  });

  // Starting point
  q.add(new Path(0, start, Vector.Right, []));

  // Marking which cells we've seen
  const seen = new Set<number>();

  let bestScore = Infinity;
  let winningPaths: Path[] = [];

  // Keep iterating on open paths
  while (q.size() > 0) {
    const path = q.poll() as Path;
    const { score, head, facing, route } = path;
    // Mark current spot as seen
    seen.add(hash(path));

    // We got to the end the most optimal way
    if (head.equals(end)) {
      // For part 2 - we don't stop here, but we cancel any less optimal paths from existence
      if (part == 2) {
        if (score < bestScore) {
          bestScore = score;
          winningPaths = [path];
        }
        if (score == bestScore) {
          winningPaths.push(path);
        }
        continue;
      }
      return score;
    }

    // Add paths with appropiate costs
    // We can skip some iterations here by combining a turn with moving forwards into one - since one can't follow the other & two turns, means going back on itself
    for (const path of [
      new Path(score + 1001, head.add(facing.turnCounterClockwise()), facing.turnCounterClockwise(), [
        ...route,
        head
      ]),
      new Path(score + 1, head.add(facing), facing, [...route, head]),
      new Path(score + 1001, head.add(facing.turnClockwise()), facing.turnClockwise(), [...route, head])
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

  return [
    start.hash(),
    end.hash(),
    ...winningPaths
      .flat()
      .map((x) => x.route)
      .flat()
      .map((v) => v.hash())
  ].distinct().length;
})
  .test(
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
  )
  .test(
    2,
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
    64
  );
