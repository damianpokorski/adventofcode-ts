import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Parse input into Vector instances & the distance they travel
  const instructions = input.map((line) => {
    const [direction, distance] = line
      .massReplace({
        up: '^',
        forward: '>',
        down: 'v'
      })
      .split(' ');
    return [Vector.fromChar(direction), parseInt(distance)] as [Vector, number];
  });

  // Part 1: Sum Vectors up
  if (part == 1) {
    const { x, y } = instructions.reduce(
      (position, [direction, distance]) =>
        position.add(direction.multiply(Vector.fromSingle(distance))),
      Vector.Zero
    );
    return x * y;
  }

  // Part 2: Track aim & position
  let position = Vector.Zero;
  let aim = 0;
  for (const [direction, distance] of instructions) {
    if (direction.isHorizontal()) {
      // Forward
      position = position.add(direction.multiply(Vector.fromSingle(distance)));
      position = position.add(new Vector(0, aim * distance));
    } else {
      // Aim change
      aim += direction.y * distance;
    }
  }
  const { x, y } = position;
  return x * y;
}).tests(
  `forward 5
down 5
forward 8
up 3
down 8
forward 2`.split('\n'),
  150,
  900
);
