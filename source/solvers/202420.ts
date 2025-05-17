/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unused-vars */
import '../utils';
import { Grid, shortestPath } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, opts) => {
  const grid = Grid.fromStrings(input);
  const start = grid.findLocationOf((v) => v == 'S')!;
  const end = grid.findLocationOf((v) => v == 'E')!;
  grid.array[end.y][end.x] = '.';

  // Use djkstra, get distance & steps taken
  const { route: path } = shortestPath(
    grid.array,
    start,
    end,
    // Any paths that are not '.' or 'E' should not be considered traversable
    (v, c, g) => c !== '.' && c !== 'E'
  );

  // Get list of steps and use their index - to calc negative distance, i.e. starting it 5th step is saving us  5 steps
  const distanceMap = new Map(path.map((v, index) => [v.hash(), index * -1]));

  // Store the best cheats
  const bestCheats = new Map<number, number>();

  // For each step, we search in radius of 2 to 20 - for available spots to jump to, then we go from there
  for (let index = 0; index < path.length; index++) {
    // Find valid path skips - we find what paths we can end up on - and then calculate steps saved
    // Skipping over 12 walls, for example can save any number of steps, but we need to the steps we've noclipped on
    for (const [otherHash, saved] of path
      // Find Paths overlapping with radius
      .filter(
        (other) => path[index].gridDistance(other) <= (part == 1 ? 2 : 20)
      )
      // Calculate distance saved
      .map(
        (other) =>
          [
            // Convert start and end to a hash - gotta go fast
            (path[index].hash() << 8) + other.hash(),
            // Caluclate distance saved: Starting point remaining distance - end point remaining distinace + distance on the grid travelled during the skip
            distanceMap.get(path[index].hash())! -
              distanceMap.get(other.hash())! +
              path[index].gridDistance(other)
          ] as [number, number]
      )
      // Filter anything not efficient enough
      .filter(([other, saved]) => saved <= -100)) {
      // Save any valid cheats into the hash
      bestCheats.set(otherHash, saved);
    }
  }

  if (opts.verbose) {
    for (const [saved, skips] of Object.entries(
      bestCheats
        .entries()
        .toArray()
        .groupBy(([key, value]) => value)
    )
      .map(([saved, skips]) => [Math.abs(parseInt(saved)), skips.length])
      .sort((a, b) => a[0] - b[0])) {
      console.log(`There are ${skips} cheats that save ${saved} picoseconds`);
    }
  }

  // Sum up the results - count keys without making a new array
  return bestCheats.keys().reduce((a, b) => a + 1, 0);
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
