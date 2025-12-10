import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const [min, max] = input.join('').split('-').asNumbers();
  let valid = 0;
  for (let i = min; i <= max; i++) {
    // Minor perf boost, skips 100000 - 111111, 200000 - 222222 etc.
    // if (i % 100000 == 0) {
    //   i = parseInt(i.toString().split('').shift()!.repeat(6));
    // }
    // if (i % 100000 !== 0 && i % 10000 == 0) {
    //   console.log(i);
    //   i = parseInt(i.toString().split('').shift()!.repeat(5));
    //   console.log({ after: i });
    // }

    const str = i.toString().split('').asNumbers();
    // Group by digits
    const groups = str.groupByToEntries((digit) => digit);
    // Check if it's consecutively going up
    let consecutive = true;
    for (let j = 1; j < str.length; j++) {
      if (str[j - 1] > str[j]) {
        consecutive = false;
        // Here we detected the non consqutive value, we can bump it to next correct value i.e. 10000 to 11111, ~1000ms difference
        i =
          parseInt(
            str
              .map((digit, index) =>
                index < j ? digit : Math.max(digit, str[j - 1])
              )
              .join('')
          ) - 1;
        break;
      }
    }
    if (!consecutive) {
      continue;
    }
    // Part 1 - Group by digit, groups of at least 2 are valid, Part 2 - Group needs to be exactly of TWO repeats
    const hasDouble = groups.find(([_, repeats]) =>
      part == 1 ? repeats.length >= 2 : repeats.length == 2
    );
    if (hasDouble) {
      valid++;
    }
  }
  return valid;
}).tests(`100000-100002`.split('\n'), 0, 0);
