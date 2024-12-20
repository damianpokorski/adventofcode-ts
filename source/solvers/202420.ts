/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unused-vars */
import '../utils';
import { Grid, shortestPath, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, opts) => {
  const grid = Grid.fromStrings(input);
  const start = grid.findLocationOf((v) => v == 'S')!;
  const end = grid.findLocationOf((v) => v == 'E')!;
  grid.array[end.y][end.x] = '.';

  // Use djkstra, get distance & steps taken
  const { steps: originalDistance, route: path } = shortestPath(
    grid.array,
    start,
    end,
    (v, c, g) => c !== '.'
  );

  // Make steps and their index - to negative distance, i.e. starting it 5th step, saves 5 steps
  const distanceMap = Object.fromEntries(path.map((v, index) => [v.hash(), index * -1]));

  // Add the end to the path
  distanceMap[end.hash()] = -originalDistance;
  path.push(end);

  // Store the best cheats
  const bestCheats = {} as Record<string, number>;

  // For each step, we search in radius of 2 to 20 - for available spots to jump to, then we go from there
  for (let index = 0; index < path.length; index++) {
    // Find valid path skips - we find what paths we can end up on - and then calculate steps saved
    // Skipping over 12 walls, for example can save any number of steps, but we need to the steps we've noclipped on
    for (const [other, saved] of path
      // Find Paths overlapping with radius
      .filter((other) => path[index].gridDistance(other) <= (part == 1 ? 2 : 20))
      // Calculate distance saved
      .map(
        (other) =>
          [
            other,
            distanceMap[path[index].hash()] - distanceMap[other.hash()] + path[index].gridDistance(other)
          ] as [Vector, number]
      )
      // Filter anything not efficient enough
      .filter(([other, saved]) => saved <= -100)) {
      const skipHash = `${path[index]}/${other}`;
      bestCheats[skipHash] = Math.min(saved, bestCheats[skipHash] ?? Number.POSITIVE_INFINITY);
    }
  }

  // Sum up the results
  let result = 0;
  for (const [saved, skips] of Object.entries(Object.entries(bestCheats).groupBy(([key, value]) => value))
    .map(([saved, skips]) => [Math.abs(parseInt(saved)), skips.length])
    .sort((a, b) => a[0] - b[0])) {
    if (opts.verbose) {
      console.log(`There are ${skips} cheats that save ${saved} picoseconds`);
    }
    if (saved >= 100) {
      result += skips;
    }
  }
  return result;
})
  .test(
    1,
    `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`.split('\n'),
    0
  )
  .test(
    2,
    `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`.split('\n'),
    0
  );
