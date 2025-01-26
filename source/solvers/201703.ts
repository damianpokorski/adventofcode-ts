import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, opts) => {
  const target = input.join().split(' ').fromStringToNumberArray().pop()!;

  // Spiral walker - constrained to square, basically reverse snake :)
  // Spiral direction doesnt matter for this problem either
  const nextStep = (v: Vector) => {
    // First move is right from 0,0
    if (v.x == 0 && v.y == 0) {
      return v.add(Vector.Right);
    }
    if (v.y > -v.x && v.x > v.y) {
      return v.add(Vector.Down);
    }
    if (v.y > -v.x && v.y >= v.x) {
      return v.add(Vector.Left);
    }
    if (v.y <= -v.x && v.x < v.y) {
      return v.add(Vector.Up);
    }
    if (v.y <= -v.x && v.x >= v.y) {
      return v.add(Vector.Right);
    }
    return Vector.Zero;
  };
  const gridValues = {
    [Vector.Zero.toString()]: 1
  } as Record<string, number>;
  let position = Vector.Zero;

  for (let i = 2; i <= target; i++) {
    // Part 1 - keep moving the head pointer to track distance, dont bother with numbers
    position = nextStep(position);
    if (part == 1) {
      continue;
    }

    // Funky cell filling
    if (part == 2) {
      const adjecentsSum = position
        .omnidirectionalAdjecents()
        .map((adj) => gridValues[adj.toString()] ?? 0)
        .sum();
      gridValues[position.toString()] = adjecentsSum;
      if (adjecentsSum > target) {
        return adjecentsSum;
      }
    }
  }
  if (part == 1) {
    return position.gridDistance(Vector.Zero);
  }
}).tests(`18`.split('\n'), 3, 23);
