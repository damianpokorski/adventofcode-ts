import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  let initialPosition = Vector.Zero;
  let initialFacing = Vector.Zero;
  const grid = input.map((row, y) =>
    row.split('').map((value, x) => {
      if (!['#', '.'].includes(value)) {
        initialPosition = new Vector(x, y);
        initialFacing = Vector.fromChar(value);
        return '.';
      }
      return value;
    })
  );

  const canMove = (position: Vector, direction: Vector) => {
    return position.add(direction).getGridValue(grid) !== '#';
  };
  const isOutOfBounds = (position: Vector) => {
    return position.getGridValue(grid) === undefined;
  };

  const walk = (start: Vector, facing: Vector, withVisitTracking: boolean, withLoopDetection: boolean) => {
    let current = start.copy();
    let currentFacing = facing.copy();
    let moves = 0;

    const visited: Vector[] = [start.copy()];
    const visitedHashes = new Set<number>();
    let loopDetected = false;
    while (!isOutOfBounds(current)) {
      if (canMove(current, currentFacing)) {
        current = current.add(currentFacing);

        // P1 - Track locations
        if (withVisitTracking && !isOutOfBounds(current)) {
          visited.push(current.copy());
        }
        // P2 - Detect cycles
        if (withLoopDetection) {
          const fastHash =
            (current.x << 8) + (current.y << 16) + (currentFacing.x << 24) + (currentFacing.y << 32);
          if (visitedHashes.has(fastHash)) {
            loopDetected = true;
            break;
          }
          visitedHashes.add(fastHash);
        }
      } else {
        currentFacing = currentFacing.turnClockwise();
      }
      moves++;
    }

    return {
      current,
      currentFacing,
      visited,
      moves,
      loopDetected
    };
  };

  // Walk through the routes
  const p1 = walk(initialPosition, initialFacing, true, true);

  const visited = p1.visited;
  if (part == 1) {
    return visited.map((x) => (x.x << 8) + x.y).distinct().length;
  }

  const loops: Vector[] = [];
  for (const entryOnPath of visited.slice(1)) {
    // Update grid with new value
    grid[entryOnPath.y][entryOnPath.x] = '#';

    // Walk again to see if it's looped
    if (walk(initialPosition, initialFacing, false, true).loopDetected) {
      loops.push(entryOnPath.copy());
    }

    // Reset the path
    grid[entryOnPath.y][entryOnPath.x] = '.';
  }

  return loops.map((x) => x.toString()).distinct().length;
})
  .test(
    1,
    `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`.split('\n'),
    41
  )
  .test(
    2,
    `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`.split('\n'),
    6
  );
