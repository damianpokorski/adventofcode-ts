import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const grid = input.map((x) => x.split(''));
  const nodes = {} as Record<string, Vector[]>;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const value = input[y][x];
      if (value !== '.') {
        if (!nodes[value]) {
          nodes[value] = [];
        }
        nodes[value].push(new Vector(x, y));
      }
    }
  }

  const isOutOfBounds = (position: Vector) => {
    return position.getGridValue(grid) === undefined;
  };

  const antifrequencies = [] as Vector[];

  for (const positions of Object.values(nodes)) {
    for (const self of positions) {
      for (const other of positions) {
        if (!self.equals(other)) {
          const magnitude = self.subtract(other);
          antifrequencies.push(self.add(magnitude));
          // Part 2 Contains repeats
          if (part == 2) {
            antifrequencies.push(self);
            // Keep incrementing magnitude unti we're out of bounds
            while (
              !isOutOfBounds(antifrequencies[antifrequencies.length - 1])
            ) {
              antifrequencies.push(
                antifrequencies[antifrequencies.length - 1].add(magnitude)
              );
            }
          }
        }
      }
    }
  }

  return antifrequencies
    .filter((value) => !isOutOfBounds(value))
    .map((value) => value.hash())
    .distinct().length;
})
  .test(
    1,
    `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`.split('\n'),
    14
  )
  .test(
    2,
    `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`.split('\n'),
    34
  );
