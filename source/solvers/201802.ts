import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Part 1: Checksum
  if (part == 1) {
    return (
      input
        .map((line) => {
          // Split to letters, group by those letters, then extra lengths of those repeated letters
          const duplicateSizes: number[] = Object.entries(
            line.split('').groupBy((character) => character)
          ).map(([_, occurences]) => occurences.length);

          return [
            duplicateSizes.includes(2) ? 1 : 0,
            duplicateSizes.includes(3) ? 1 : 0
          ];
        })
        // Sum tuples
        .reduce(([a, b], [c, d]) => [a + c, b + d], [0, 0])
        // Multiple results
        .reduce((a, b) => a * b, 1)
    );
  }

  // Part 2:
  // Iterate through combinations
  // Each iteration resets buffer
  // Every matching value gets added to the buffer
  // On mismatch, check buffer size against current index - if buffer is smaller - it's 2nd mismatch
  let buffer = '';
  input.combinations(2).find(([a, b]) => {
    buffer = '';
    for (let i = 0; i < a.length; i++) {
      if (a[i] == b[i]) {
        buffer += a[i];
      } else {
        if (buffer.length < i) {
          return false;
        }
      }
    }
    return true;
  });
  return buffer;
})
  .test(
    1,
    [`abcdef`, `bababc`, `abbcde`, `abcccd`, `aabcdd`, `abcdee`, `ababab`],
    12
  )
  .test(
    2,
    [`abcde`, `fghij`, `klmno`, `pqrst`, `fguij`, `axcye`, `wvxyz`],
    'fgij'
  );
