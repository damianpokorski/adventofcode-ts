import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Part 1
  const memory = input.asNumbers();
  let index = 0;
  let counter = 0;
  while (index >= 0 && index < memory.length) {
    const jump = memory[index];
    if (memory[index] !== undefined) {
      // In part 1 we increment memory values 1 by 1, in part 2 if the jump is 3 or longer - we decrement it instead
      memory[index] += part == 1 ? 1 : jump >= 3 ? -1 : 1;
    }
    index += jump;
    counter++;
  }
  return counter.toString();
}).tests(
  `0
3
0
1
-3`.split('\n'),
  5,
  10
);
