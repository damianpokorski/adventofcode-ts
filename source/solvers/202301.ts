import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
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
    .map((line) => {
      const first = getFirstDigit(line.substringFind((x) => hasNumber(parse(x))) ?? '');
      const last = getFirstDigit(line.substringFind((x) => hasNumber(parse(x)), 'rtl') ?? '');
      return parseInt(`${first ?? last}${last ?? first}`);
    })
    .sum()
    .toString();
})
  .test(1, [`1abc2`, `pqr3stu8vwx`, `a1b2c3d4e5f`, `treb7uchet`], '142')
  .test(
    2,
    [
      `two1nine`,
      `eightwothree`,
      `abcone2threexyz`,
      `xtwone3four`,
      `4nineeightseven2`,
      `zoneight234`,
      `7pqrstsixteen`
    ],
    '281'
  );
