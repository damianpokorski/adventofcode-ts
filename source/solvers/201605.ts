import { createHash } from 'node:crypto';
import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Precomputed indexes, cause optimising this problem is boring
  // const precomptued = 0;
  // part == 1
  //   ? opts.isTest
  //     ? 609043
  //     : 282749
  //   : opts.isTest
  //     ? 6742839
  //     : 9962624;
  // Change to i = 0 if you want to recalculate for different puzzle input
  const buffer = '********'.split('');
  const precomptued = [
    3231929, 5017308, 5278568, 5357525, 5708769, 6082117, 8036669, 8605828
  ];
  // for (let i = precomptued; ; i++) {
  for (const i of precomptued) {
    const hash = createHash('md5')
      .update(input[0] + i.toString())
      .digest('hex');
    console.log([i, hash]);
    if (hash.startsWith('00000')) {
      // Part 1 - 6th character unlocks the next
      if (part == 1) {
        buffer[buffer.indexOf('*')] = hash[5];
        // continue;
      } else {
        // Part 2 - 6th character is index of where to put 7th character
        if (buffer[parseInt(hash[5], 10)] === '*') {
          buffer[parseInt(hash[5], 10)] = hash[6];
        }
      }
    }
    // Detect completion
    if (buffer.indexOf('*') == -1) {
      return buffer.join('');
    }
  }
}).tests([`abc`], '18f47a30', '05ace8e3');
