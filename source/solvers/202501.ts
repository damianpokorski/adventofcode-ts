import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  let counter = 0;
  input
    .map((line) =>
      line.substring(0, 1) == 'R' ? +line.substring(1) : -line.substring(1)
    )
    .reduce((current, next) => {
      const increment = next / Math.abs(next);
      while (next !== 0) {
        next -= increment;
        current += increment;
        // Wrap around negative and positive overflows
        current = (current < 0 ? current + 100 : current) % 100;

        // Part 2 - If we encounter a 0 at any point, increment the counter
        if (part == 2 && current == 0) {
          counter++;
        }
      }
      // Part 1 - Landing on 0 at the end increments the counter
      if (part == 1 && current == 0) {
        counter++;
      }
      return current;
    }, 50);
  return counter;
}).tests(
  `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`.split('\n'),
  3,
  6
);
