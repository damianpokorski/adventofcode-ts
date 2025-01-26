import { Queue } from 'typescript-collections';
import '../utils';
import { Grid, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const isTest = input.length < 100;
  // Create grid
  const gridSize = isTest ? 6 : 70;
  const start = new Vector(0, 0);
  const end = new Vector(gridSize, gridSize);

  // Populate walls
  const walls = input
    .map((line) => line.split(',').map((value) => parseInt(value)))
    .map(([x, y]) => new Vector(x, y));

  const distance = (corruptions: number) => {
    // Create grid
    const grid = Grid.createAndFill(gridSize + 1, gridSize + 1, () => true as boolean);
    const gridRaw = grid.array;

    for (const { x, y } of walls.slice(0, corruptions)) {
      gridRaw[y][x] = false;
    }

    // Open paths - We could use priority queue here like in day 11, but in this case we just going based off consistent number of steps
    const paths = new Queue<{ head: Vector; step: number }>();
    paths.add({ head: start, step: 0 });

    // Tracking visited spots
    const seen = new Set<number>();
    seen.add(Vector.Zero.hash());

    while (paths.size() > 0) {
      // Grab a path
      const path = paths.dequeue()!;

      // Reached the end!
      if (end.equals(path.head)) {
        return path.step;
      }

      for (const next of path.head.adjecents()) {
        // Stay in bounds
        if (next.x < 0 || next.y < 0 || next.x > gridSize || next.y > gridSize) {
          continue;
        }
        // False - means valid path, true # wall
        if (next.getGridValue(gridRaw) !== true) {
          continue;
        }

        // Skip any we might've already been here
        if (seen.has(next.hash())) {
          continue;
        }

        // We're marking this spot as visited & opening next
        seen.add(next.hash());
        paths.add({ head: next, step: path.step + 1 });
      }
    }
    return -1;
  };

  if (part == 1) {
    return distance(isTest ? 12 : 1024);
  }

  // Binary search it - guessing somewhere in the middle, dialing down
  // i.e. 0..1024 - we check if 0..512 - give us a valid answer, if so...
  //  we know the "blocking" wall falls within 513..1024 & so forth until we reach exact value
  let low = 0;
  let high = walls.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (distance(middle) >= 0) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  return walls[low - 1]?.toString() ?? '';
})
  .test(
    1,
    `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`.split('\n'),
    22
  )
  .test(
    2,
    `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`.split('\n'),
    `6,1`
  );
