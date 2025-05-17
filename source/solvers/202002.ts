import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return input
    .map((line) => {
      const [constraintsRaw, letter, password] = line
        .replace(':', '')
        .split(' ');
      const [a, b] = constraintsRaw.split('-').map((x) => parseInt(x));
      return [a, b, letter, password] as [number, number, string, string];
    })
    .filter(([a, b, letter, password]) => {
      // Part 1: a,b - range of which the supplied letter needs to occur in password for it to be valid
      if (part == 1) {
        const requiredLEtterOccurences = password
          .split('')
          .filter((x) => x == letter).length;
        return (
          (a > requiredLEtterOccurences || b < requiredLEtterOccurences) ==
          false
        );
      }
      // Part 2: a,b - index (non zero based) letter, XOR
      return (password[a - 1] == letter) !== (password[b - 1] == letter);
    }).length;
}).tests(
  `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`.split('\n'),
  2,
  1
);
