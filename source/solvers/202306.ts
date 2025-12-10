import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Part 1 process columns individually, part 2 - treat them as 1 big number
  const [times, records] = input.map((line) =>
    part == 1
      ? line.split(/\s+/).slice(1).asNumbers()
      : [line.split(/\s+/).slice(1).join('')].asNumbers()
  );
  const pairs = times.map(
    (t, index) => [t, records[index]] as [number, number]
  );

  // Go through all of the possibilities of charging up, 1 second of charging up = 1 second of speed
  return pairs
    .map(([time, record]) => {
      let possibilities = 0;
      for (let speed = 0; speed < time; speed++) {
        if (speed * (time - speed) > record) {
          possibilities++;
        }
      }
      return possibilities;
    })
    .reduce((a, b) => a * b);
}).tests(
  `Time:      7  15   30
Distance:  9  40  200`.split('\n'),
  288,
  71503
);
