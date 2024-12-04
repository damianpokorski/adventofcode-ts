import '../utils';
import { initialize } from '../utils/registry';

const validate = (row: number[]) => {
  // Get diffs
  const deltas = row
    .map((value, index, set) => {
      return index == 0 ? undefined : set[index - 1] - value;
    })
    .filter((value) => value !== undefined);

  // Count entries
  const positive = deltas.filter((value) => value > 0).length;
  const negatives = deltas.filter((value) => value < 0).length;
  const outsideOfSafeRange = deltas.filter((value) => ![1, 2, 3].includes(Math.abs(value))).length;

  // Biggest set - full deltas = number of invalid entries
  const errors = deltas.length - Math.max(positive, negatives) + outsideOfSafeRange;

  return errors == 0;
};

const validateSubsetsByDroppingOneEntry = (row: number[]) => {
  for (let i = 0; i < row.length; i++) {
    if (validate(row.filter((_, index) => index !== i))) {
      return true;
    }
  }
  return false;
};

initialize(__filename, async (part, input) => {
  const data = input
    .map((row) => row.split(' '))
    .map((row) => row.map((value) => parseInt(value)))
    .filter((row) => validate(row) || (part == 2 && validateSubsetsByDroppingOneEntry(row)));

  return data.length.toString();
})
  .test(1, [`7 6 4 2 1`, `1 2 7 8 9`, `9 7 6 2 1`, `1 3 2 4 5`, `8 6 4 4 1`, `1 3 6 7 9`], '2')
  .test(2, [`7 6 4 2 1`, `1 2 7 8 9`, `9 7 6 2 1`, `1 3 2 4 5`, `8 6 4 4 1`, `1 3 6 7 9`], '4');
