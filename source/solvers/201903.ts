import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Map each wires from input
  const [pathA, pathB] = input.map((line) =>
    Object.fromEntries(
      line
        .split(',')
        .map(([direction, ...distance]) =>
          [...new Array(parseInt(distance.join('')))].map(() => Vector.fromUDLR(direction))
        )
        // Convert array of steps to array of visited stops
        .flat()
        // Incrementally build paths & track length of steps for each position
        .reduce(
          (steps: [Vector, number][], next: Vector) => {
            steps.push([steps[steps.length - 1][0].add(next), steps.length]);
            return steps;
          },
          [[Vector.Zero, 0]]
        )
        // Build set of all data we'll need
        .map((entry, index) => ({
          position: entry[0],
          hash: entry[0].hash(),
          distanceFromCenter: entry[0].gridDistance(Vector.Zero),
          steps: entry[1],
          index
        }))
        .map((entry) => [entry.hash, entry])
    )
  );

  // Find overlaps
  const overlaps = Object.keys(pathA)
    .values()
    .filter((hash) => pathA[hash].index > 0 && pathB[hash] !== undefined)
    .toArray();

  // Convert overlaps to distance from 0,0, pick shortest
  return (
    overlaps
      // Part 1 - distance of overlap from the center, part 2 combined length of wires contributing to overlap
      .map((hash) => (part == 1 ? pathA[hash].distanceFromCenter : pathA[hash].steps + pathB[hash].steps))
      .sort((a, b) => a - b)
      .shift()
  );
}).tests(
  `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`.split('\n'),
  159,
  610
);
