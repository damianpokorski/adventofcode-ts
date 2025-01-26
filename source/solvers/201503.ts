import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Part 1: Apply ^v<> to single position
  // Part 2: Apply ^v<> to two positions based on index
  // Both: Get unique positions
  return input
    .join('')
    .split('')
    .map((direction) => Vector.fromChar(direction))
    .reduce(
      (visitedSets, move, index) => {
        // Pick correct set based on part & index
        const setToUpdate = visitedSets[part == 1 ? 0 : index % 2];
        // Grab last element of it, add move -> push it back
        setToUpdate.push(setToUpdate[setToUpdate.length - 1].add(move));
        // Return both
        return visitedSets;
      },
      [[Vector.Zero], [Vector.Zero]] as Vector[][]
    )
    .flat()
    .map((position) => position.hash())
    .distinct().length;
}).tests(`^v^v^v^v^v`.split('\n'), 2, 11);
