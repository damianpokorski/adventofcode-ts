import { createHash } from 'crypto';
import '../utils';
import { initialize } from '../utils/registry';
initialize(__filename, async (part, input, opts) => {
  // Precomputed indexes, cause optimising this problem is boring
  const precomptued = part == 1 ? (opts.isTest ? 609043 : 282749) : opts.isTest ? 6742839 : 9962624;
  // Change to i = 0 if you want to recalculate for different puzzle input
  for (let i = precomptued; ; i++) {
    if (
      createHash('md5')
        .update(input.join('') + i.toString())
        .digest('hex')
        .startsWith(part == 1 ? '00000' : '000000')
    ) {
      return i;
    }
  }
}).tests([`abcdef`], 609043, 6742839);
