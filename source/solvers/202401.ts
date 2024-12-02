import '../utils';
import { registerUsingFilename } from '../utils/registry';

registerUsingFilename(__filename, async (part, input) => {
  const parsed = input
    .map((line) => line.split('   '))
    .map(([a, b]) => [parseInt(a), parseInt(b)]) as [number, number][];

  const left = parsed.map((input) => input[0]).sort();
  const right = parsed.map((input) => input[1]).sort();

  if (part == 1) {
    return left
      .zip(right)
      .map(([a, b]) => Math.abs(a - b))
      .reduce((a, b) => a + b, 0)
      .toString();
  }

  return left
    .map((a) => a * right.filter((b) => a == b).length)
    .reduce((a, b) => a + b, 0)
    .toString();
});
