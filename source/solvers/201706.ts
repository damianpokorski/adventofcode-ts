import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  let banks = input[0].split('\t').asNumbers();

  const process = (memory: number[]) => {
    // Find the first biggest bank
    let blocks = Math.max(...memory);
    const highestIndex = memory.findIndex((bank) => bank == blocks);

    // Empty it
    memory[highestIndex] = 0;

    // Redistribute blocks
    let index = highestIndex;
    while (blocks > 0) {
      // Wrap around index for redistribution
      index = (index + 1) % memory.length;
      blocks--;
      memory[index]++;
    }
    return memory;
  };
  const hashFn = (memory: number[]) => memory.join('/');

  // Keep redistributing until we find a mash
  const uniques = new Set([hashFn(banks)]);
  while (true) {
    banks = process(banks);
    const hash = hashFn(banks);
    if (uniques.has(hash)) {
      break;
    }
    uniques.add(hash);
  }

  // Part 1 - total unique entries, part 2 - distance since the recurrence
  return part == 1
    ? uniques.size
    : uniques.size - [...uniques].indexOf(banks.join('/'));
}).tests('0	2	7	0'.split('\n'), 5, 4);
