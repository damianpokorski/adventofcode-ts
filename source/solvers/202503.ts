import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return input
    .map((line) => line.split('').asNumbers())
    .map((batteries, index) => {
      if (part == 1) {
        let max = 0;
        for (let i = 0; i < batteries.length - 1; i++) {
          for (let j = i + 1; j < batteries.length; j++) {
            max = Math.max(max, batteries[i] * 10 + batteries[j]);
          }
        }
        return max;
      }

      // Sliding window of 12 - Start with initial set
      let best = batteries.slice(0, 12);

      // Keep sliding right
      for (let i = 1; i <= batteries.length - best.length; i++) {
        const window = batteries.slice(i, i + best.length);

        // For each entry in slides, compare
        // - if the new window is shorter, splice best & new together
        for (let j = 0; j < window.length; j++) {
          if (best[j] < window[j]) {
            best = [...best.slice(0, j), ...window.slice(j)];
            break;
          }
        }
      }
      return parseInt(best.join(''), 10);
    })
    .sum();
}).tests(
  `987654321111111
811111111111119
234234234234278
818181911112111`.split('\n'),
  357,
  3121910778619
);
