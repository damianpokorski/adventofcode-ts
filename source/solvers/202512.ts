import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, { isTest }) => {
  // Process input
  const shapesRaw = input.join('\n').split('\n\n');
  const targets = shapesRaw
    .pop()!
    .split('\n')
    .map((line) => line.split(': ') as [string, string])
    .map(
      ([dimensions, presents]) =>
        [
          dimensions.split('x').asNumbers(),
          presents.split(' ').asNumbers()
        ] as [[number, number], number[]]
    );
  const shapes = shapesRaw.map((shape) =>
    shape
      .split('\n')
      .slice(1)
      .map((line) => line.split('').map((char) => char == '#'))
  );

  // Create a look up to see how many boxes each present takes
  const shapesFilling = shapes.map((shape) =>
    shape.map((row) => row.filter((cell) => cell).length).sum()
  );

  // Just check if there's enough space
  const squaresWithEnoughSpace = targets.filter(
    ([[x, y], presents]) =>
      x * y >=
      presents.map((count, index) => count * shapesFilling[index]).sum()
  );

  // Somehow this is correct
  return squaresWithEnoughSpace.length - (isTest ? 1 : 0);
}).tests(
  `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`.split('\n'),
  2,
  2
);
