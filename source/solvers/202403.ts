import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Challenged myself to do this one without creating any variables directly
  return (
    part == 1
      ? input.join('')
      : input
          .join('')
          .split('do()')
          .map((does) => does.split("don't()").shift())
          .join()
  )
    .split('mul(')
    .map((section) => section.split(')').shift() as string)
    .filter((op) => op && op !== '')
    .filter((op) => /^(\d|,)+$/.test(op))
    .map((op) => op.split(','))
    .map(([a, b]) => [parseInt(a), parseInt(b)])
    .filter(([a, b]) => !isNaN(a) && !isNaN(b))
    .map(([a, b]) => a * b)
    .sum();
})
  .test(1, [`xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`], '161')
  .test(2, [`xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`], '48');
