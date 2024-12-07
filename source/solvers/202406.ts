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

  const walk = (start: Vector, facing: Vector) => {
    let current = start.copy();
    let currentFacing = facing.copy();
    let moves = 0;

    const visited: Vector[] = [start.copy()];
    const visitedHashes = new Set<string>();
    let loopDetected = false;
    while (!isOutOfBounds(current)) {
      if (canMove(current, currentFacing)) {
        current = current.add(currentFacing);
        // Mark we've visited new spot
        visited.push(current.copy());

        // Add a new hash - if the entry exists - we're in a loop
        if (!visitedHashes.has(current.toString() + '/' + currentFacing.toString())) {
          visitedHashes.add(current.toString() + '/' + currentFacing.toString());
        } else {
          loopDetected = true;
          break;
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
  const p1 = walk(initialPosition, initialFacing);

  const visited = p1.visited.filter((x) => !isOutOfBounds(x));
  if (part == 1) {
    return visited.map((x) => x.toString()).distinct().length;
  }

  const loops: Vector[] = [];
  for (const entryOnPath of visited.slice(1)) {
    // Update grid with new value
    grid[entryOnPath.y][entryOnPath.x] = '#';

    // Walk again to see if it's looped
    if (walk(initialPosition, initialFacing).loopDetected) {
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
