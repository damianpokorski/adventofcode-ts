import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return (
    input
      .join('')
      .split('')
      .map((number) => parseInt(number))
      // Create pairs
      .map((number, index, arr) => {
        if (part == 1) {
          // Pair with next element, circularly
          return [number, arr[index < arr.length - 1 ? index + 1 : 0]] as [number, number];
        }

        // Halfway around circular array
        return [number, arr[(index + arr.length / 2) % arr.length]] as [number, number];
      })
      // Filter to matches only, sum them up
      .filter(([current, next]) => current == next)
      .map(([current, next]) => current)
      .sum()
  );
})
  .test(1, [`1122`], 3)
  .test(2, [`1212`], 6);
