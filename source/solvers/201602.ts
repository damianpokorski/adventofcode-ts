import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Keypads, part 1 is a grid, part 2 is a diamond, both start at 5
  const grid: (string | number | undefined)[][] =
    part == 1
      ? [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ]
      : [
          [undefined, undefined, 1, undefined, undefined],
          [undefined, 2, 3, 4, undefined, undefined],
          [5, 6, 7, 8, 9],
          [undefined, 'A', 'B', 'C', undefined, undefined],
          [undefined, undefined, 'D', undefined, undefined]
        ];
  let startPoint = part == 1 ? new Vector(1, 1) : new Vector(0, 2);

  return input
    .map((row) => row.split(''))
    .map((row) => {
      // Save result into the starting point for next input - then fetch value
      startPoint = row
        .map((cell) => Vector.fromUDLR(cell))
        .reduce((position, nextStep) => {
          // Only move if the next step is valid
          if (position.add(nextStep).getGridValue(grid) !== undefined) {
            return position.add(nextStep);
          }
          return position;
        }, startPoint);
      return startPoint.getGridValue(grid);
    })
    .join('');
}).tests(
  `ULL
RRDDD
LURDL
UUUUD`.split('\n'),
  '1985',
  '5DB3'
);
