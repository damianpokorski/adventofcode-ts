import '../utils';
import { registerUsingFilename } from '../utils/registry';

registerUsingFilename(__filename, async (part, input) => {
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
    .sum()
    .toString();
});
