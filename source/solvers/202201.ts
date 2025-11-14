import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return input
    .join('\n')
    .split('\n\n')
    .map((elf) => elf.split('\n').fromStringToNumberArray().sum())
    .sort((a, b) => b - a)
    .slice(0, part == 1 ? 1 : 3)
    .sum();
}).tests(
  `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`.split('\n'),
  24000,
  45000
);
