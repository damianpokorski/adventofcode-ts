import { createHash } from 'node:crypto';
import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, opts) => {
  // Change to i = 0 if you want to recalculate for different puzzle input
  const buffer = '********'.split('');

  // Replace below with `const precomputed: number[] = []` - to recalculate from scratch, takes about @15s bruteforcing - which makes this quite a boring puzzle
  const usePrecomputed: boolean = true;
  const precomputed: number[] = !usePrecomputed
    ? []
    : opts.isTest
      ? part == 1
        ? [
            3231929, 5017308, 5278568, 5357525, 5708769, 6082117, 8036669,
            8605828
          ]
        : [
            3231929, 5357525, 5708769, 8036669, 8605828, 8609554, 13666005,
            13753421
          ]
      : part == 1
        ? [
            2231254, 2440385, 2640705, 3115031, 5045682, 8562236, 9103137,
            9433034
          ]
        : [
            9103137, 13753308, 13976178, 15855849, 16774052, 19808390, 20774189,
            27712456
          ];

  const indexes = [] as number[];
  let i = 0;
  while (true) {
    const hash = createHash('md5')
      .update(input[0] + i.toString())
      .digest('hex');
    if (hash.startsWith('00000')) {
      // Part 1 - 6th character unlocks the next
      if (part == 1) {
        buffer[buffer.indexOf('*')] = hash[5];
        indexes.push(i);
      } else {
        // Part 2 - 6th character is index of where to put 7th character
        if (buffer[parseInt(hash[5], 10)] === '*') {
          buffer[parseInt(hash[5], 10)] = hash[6];
          indexes.push(i);
        }
      }
      // Detect completion
      if (buffer.indexOf('*') == -1) {
        if (precomputed.length == 0) {
          console.log({ indexes, part, test: opts.isTest });
        }
        return buffer.join('');
      }
    }
    i = precomputed.length > 0 ? precomputed.find((x) => x > i)! : i + 1;
  }
}).tests([`abc`], '18f47a30', '05ace8e3');
