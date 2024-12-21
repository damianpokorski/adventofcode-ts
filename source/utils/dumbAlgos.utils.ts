import { Queue } from 'typescript-collections';
import { Vector } from './vector.utils';

export const floodFill = <T>(vector: Vector, getter: (v: Vector) => T) => {
  const set = [] as Vector[];
  const value = getter(vector);
  // If value is not set - return nothing
  if (value == undefined) {
    return set;
  }

  // Add current node to the set
  set.push(vector);

  while (true) {
    // Expand
    const expands = set
      // -> Filter to adjecent matching values & flatten
      .map((cell) => cell.adjecents().filter((adjecent) => getter(adjecent) == value))
      .flat()
      .distinct((v) => v.hash())
      // -> Ignore ones already in our set
      .filter((cell) => !set.find((knownCell) => knownCell.equals(cell)));

    if (expands.length == 0) {
      break;
    }
    set.push(...expands);
  }
  return set;
};

export const shortestPath = <T>(
  grid: T[][],
  start: Vector,
  end: Vector,
  invalidPath: (v: Vector, cell: T, grid: T[][]) => boolean
) => {
  // Constrain to looking on the grid
  const gridSizeY = grid.length;
  const gridSizeX = grid[0].length;

  // Build a queue and add a starting point
  const paths = new Queue<{ head: Vector; step: number; route: Vector[] }>();
  paths.add({ head: start, step: 0, route: [start] });

  // Tracking visited spots
  const seen = new Set<number>();
  seen.add(Vector.Zero.hash());

  // While there are paths to visit, continue visitig
  while (paths.size() > 0) {
    // Grab a next path on a list
    const path = paths.dequeue()!;

    // Reached the end! - Because we keep searching the closest traveled paths first, we're guaranteed to have found the best one
    if (end.equals(path.head)) {
      return { steps: path.step, route: path.route };
    }

    // For each adjecent point
    for (const next of path.head.adjecents()) {
      // Do not go out of bounds
      if (next.x < 0 || next.y < 0 || next.x >= gridSizeX || next.y >= gridSizeY) {
        continue;
      }

      // Skip any we might've already been here
      if (seen.has(next.hash())) {
        continue;
      }

      // Invalid path takes next points and returns whether it's valid or not, usually checking if it's a '#'
      if (invalidPath(next, next.getGridValue(grid)!, grid)) {
        continue;
      }

      // We're marking this spot as visited - to prevent other paths trying to go down this path again
      seen.add(next.hash());

      // We add the next steop in paths
      paths.add({ head: next, step: path.step + 1, route: [...path.route, next] });
    }
  }
  return { steps: Number.POSITIVE_INFINITY, route: [] };
};

export const allPaths = <T>(
  grid: T[][],
  start: Vector,
  end: Vector,
  invalidPath: (v: Vector, cell: T, grid: T[][]) => boolean
) => {
  // Constrain to looking on the grid
  const gridSizeY = grid.length;
  const gridSizeX = grid[0].length;

  // Build a queue and add a starting point
  const paths = new Queue<{ head: Vector; step: number; route: Vector[]; seen: Set<number> }>();
  paths.add({ head: start, step: 0, route: [start], seen: new Set() });

  let allPaths = [] as Vector[][];
  let bestDistance = Number.POSITIVE_INFINITY;

  // While there are paths to visit, continue visitig
  while (paths.size() > 0) {
    // Grab a next path on a list
    const path = paths.dequeue()!;

    // For each adjecent point
    for (const next of path.head.adjecents()) {
      // Do not go out of bounds
      if (next.x < 0 || next.y < 0 || next.x >= gridSizeX || next.y >= gridSizeY) {
        continue;
      }

      // Skip any we might've already been here
      if (path.seen.has(next.hash())) {
        continue;
      }

      // Invalid path takes next points and returns whether it's valid or not, usually checking if it's a '#'
      if (invalidPath(next, next.getGridValue(grid)!, grid)) {
        continue;
      }

      // Skip any paths that are longer than best
      if (path.step + 1 > bestDistance) {
        continue;
      }

      // We build next path structre
      const nextPath = {
        head: next,
        step: path.step + 1,
        route: [...path.route, next],
        seen: new Set([...path.seen, next.hash()])
      };

      // If we're at the end - save the best
      if (next.equals(end)) {
        // If we found a better path, reset stored paths
        if (nextPath.step < bestDistance) {
          allPaths = [];
          bestDistance = nextPath.step;
        }
        // Save the path
        allPaths.push(nextPath.route);
      } else {
        paths.add(nextPath);
      }
    }
  }
  return allPaths;
};
