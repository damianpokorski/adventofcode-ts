import { Memoize } from 'typescript-memoize';
import '../utils';
import { initialize } from '../utils/registry';

class Calc {
  @Memoize((stone: number, blinks: number) => `${stone};${blinks}`)
  public static getNumberOfStones(stone: number, blinks: number): number {
    // No more blinks - we got 1 stone!
    if (blinks == 0) {
      return 1;
    }
    // 0 -> 1
    if (stone == 0) {
      return Calc.getNumberOfStones(1, blinks - 1);
    }
    // Stones with 2 numbers of digits -> Split into two
    const string = stone.toString();
    if (string.length % 2 == 0) {
      const left = parseInt(string.slice(0, string.length / 2));
      const right = parseInt(string.slice(string.length / 2));
      return Calc.getNumberOfStones(left, blinks - 1) + Calc.getNumberOfStones(right, blinks - 1);
    }

    // * 2024 anything else
    return Calc.getNumberOfStones(stone * 2024, blinks - 1);
  }
}

initialize(__filename, async (part, input) => {
  const stones = input
    .join('')
    .split(' ')
    .map((value) => parseInt(value));

  let numberOfStones = 0;
  for (const stone of stones) {
    numberOfStones += Calc.getNumberOfStones(stone, part == 1 ? 25 : 75);
  }

  return numberOfStones;
})
  .test(1, `125 17`.split('\n'), 55312)
  .test(2, `125 17`.split('\n'), 65601038650482);
