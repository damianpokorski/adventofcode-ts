import '../utils';
import { EarlyReturn, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const visited = new Set<string>();
  return (
    input
      // Parse R123, L7 etc into ['R', 123] tuples
      .join('')
      .split(', ')
      .map(
        (row) =>
          [row.substring(0, 1), parseInt(row.substring(1))] as [
            'L' | 'R',
            number
          ]
      )
      // Using abortable to cheekily have an early return on reduce
      .abortableReduce(
        ({ facing, position }, [turn, distance]) => {
          // Turn
          facing =
            turn == 'R'
              ? facing.turnClockwise()
              : facing.turnCounterClockwise();

          // Stepping 1 by 1 over distance
          for (let i = 0; i < distance; i++) {
            position = position.add(facing);

            // Part 2 - Check if we've visited & abort
            if (part == 2 && visited.has(position.toString())) {
              throw new EarlyReturn({ facing, position });
            }
            visited.add(position.toString());
          }
          return { facing, position };
        },
        { facing: Vector.Up, position: Vector.Zero }
      )
      ?.position.gridDistance(Vector.Zero)
  );
}).tests(`R5, L5, R5, R3`.split('\n'), 12, 12);
