import '../utils';
import { initialize } from '../utils/registry';

// Memoization
const divisorsCache = {} as Record<number, number[]>;
const divisors = function divisors(integer: number) {
  if (divisorsCache[integer]) {
    return divisorsCache[integer];
  }
  const result: number[] = [];
  for (let i = 2; i <= integer; i++) {
    if (integer % i == 0) {
      result.push(i);
    }
  }
  divisorsCache[integer] = result;
  return result;
};

initialize(__filename, async (part, input) => {
  const ranges = [...input]
    .shift()
    ?.split(',')
    .map(
      (range) => range.split('-').fromStringToNumberArray() as [number, number]
    )!;

  return ranges
    .map(([start, end]) => {
      let sum = 0;
      for (let i = start; i <= end; i++) {
        const str = i.toString();
        if (part == 1) {
          const a = str.substring(0, str.length / 2);
          const b = str.substring(str.length / 2);
          if (a == b) {
            sum += i;
          }
        }
        if (part == 2) {
          for (const divisor of divisors(str.length)) {
            // Figure out chunk size
            const chunkSize = str.length / divisor;

            // Get the first chunk
            const chunk = str.substring(0, chunkSize);
            let match = true;

            // Iterate through subsequent chunks
            for (let index = 1; index < divisor; index++) {
              if (
                str.substring(index * chunkSize, (index + 1) * chunkSize) !==
                chunk
              ) {
                match = false;
                break;
              }
            }
            if (match) {
              sum += i;
              break;
            }
          }
        }
      }
      return sum;
    })
    .sum();
}).tests(
  [
    `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`
  ],
  1227775554,
  4174379265
);
