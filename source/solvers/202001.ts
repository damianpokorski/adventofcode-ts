import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Combination search for sum of items, mutliple individuals for final result
  // Cheekily using part 1 and 2, as base - as first part involves 2 items, while 2nd one involves 3
  return input
    .fromStringToNumberArray()
    .combinations(+part + 1)
    .find((arr) => arr.sum() == 2020)!
    .reduce((a, b) => a * b, 1);
}).tests(
  `1721
979
366
299
675
1456`.split('\n'),
  514579,
  241861950
);
