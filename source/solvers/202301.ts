import '../utils';
import { registerUsingFilename } from '../utils/registry';

registerUsingFilename(__filename, async (part, input) => {
  // Regex check for digit
  const hasNumber = (x: string) => /\d/g.test(x);

  // Swap words to digits depending on part
  const parse = (input: string) =>
    part == 1
      ? input
      : input.massReplace({
          one: '1',
          two: '2',
          three: '3',
          four: '4',
          five: '5',
          six: '6',
          seven: '7',
          eight: '8',
          nine: '9'
        });

  // Get first digit from string
  const getFirstDigit = (input: string): number =>
    parseInt(
      parse(input)
        .split('')
        .find((x) => hasNumber(x)) ?? ''
    );

  return input
    .map((line, index) => {
      let first = getFirstDigit(line.substringFind((x) => hasNumber(parse(x))) ?? '');
      let last = getFirstDigit(line.substringFind((x) => hasNumber(parse(x)), 'rtl') ?? '');
      return parseInt(`${first ?? last}${last ?? first}`);
    })
    .sum()
    .toString();
});
