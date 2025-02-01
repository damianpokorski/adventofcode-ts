import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const [min, max] = input.join('').split('-').fromStringToNumberArray();
  let valid = 0;
  for (let i = min; i <= max; i++) {
    const str = i.toString().split('').fromStringToNumberArray();
    // Group by digits
    const groups = str.groupByToEntries((digit) => digit);
    // Check if it's consecutively going up
    let consecutive = true;
    for (let j = 1; j < str.length; j++) {
      if (str[j - 1] > str[j]) {
        consecutive = false;
        break;
      }
    }
    if (!consecutive) {
      continue;
    }
    // Part 1 - Group by digit, groups of at least 2 are valid, Part 2 - Group needs to be exactly of TWO repeats
    const hasDouble = groups.find(([_, repeats]) => (part == 1 ? repeats.length >= 2 : repeats.length == 2));
    if (hasDouble) {
      valid++;
    }
  }
  return valid;
}).tests(`100000-100002`.split('\n'), 0, 0);
