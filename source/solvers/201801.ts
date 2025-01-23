import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Parse
  const changes = input.map((row) => row.replace('+', '')).map((row) => parseInt(row));

  // Current tally
  let frequency = 0;

  // Part 2 - Store visited
  const observedFrequencies = new Set<number>();

  // Part 1 - sum, part 2 - first repeat
  while (part == 1 ? observedFrequencies.size == 0 : true) {
    for (const value of changes) {
      frequency += value;
      if (observedFrequencies.has(frequency)) {
        return frequency;
      }
      observedFrequencies.add(frequency);
    }
  }
  return frequency;
})
  .test(1, [`+1`, `+1`, `+1`], 3)
  .test(2, [`+3`, `+3`, `+4`, `-2`, `-4`], 10);
