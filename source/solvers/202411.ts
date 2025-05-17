import '../utils';
import { memoize } from '../utils';
import { initialize } from '../utils/registry';

const getNumberOfStones = memoize(
  (tuple: [number, number]): number => {
    const [stone, blinks] = tuple;
    // No more blinks - we got 1 stone!
    if (blinks == 0) {
      return 1;
    }
    // 0 -> 1
    if (stone == 0) {
      return getNumberOfStones([1, blinks - 1]);
    }
    // Stones with 2 numbers of digits -> Split into two
    const string = stone.toString();
    if (string.length % 2 == 0) {
      const left = parseInt(string.slice(0, string.length / 2));
      const right = parseInt(string.slice(string.length / 2));
      return (
        getNumberOfStones([left, blinks - 1]) +
        getNumberOfStones([right, blinks - 1])
      );
    }

    // * 2024 anything else
    return getNumberOfStones([stone * 2024, blinks - 1]);
  },
  (tuple: [number, number]) => `${tuple[0]};${tuple[1]}`
);

initialize(__filename, async (part, input) => {
  const stones = input
    .join('')
    .split(' ')
    .map((value) => parseInt(value));

  let numberOfStones = 0;
  for (const stone of stones) {
    numberOfStones += getNumberOfStones([stone, part == 1 ? 25 : 75]);
  }

  return numberOfStones;
})
  .test(1, `125 17`.split('\n'), 55312)
  .test(2, `125 17`.split('\n'), 65601038650482);
