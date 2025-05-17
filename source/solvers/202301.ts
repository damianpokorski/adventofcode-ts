import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Swap words to digits depending on part
  const parse = (input: string) =>
    part == 1 ? input : input.swapSpelledOutDigitsToNumbers();

  return input
    .map((line) => {
      const first = parse(
        line.substringFind((x) => parse(x).hasNumber()) ?? ''
      ).extractNumbers();
      const last = parse(
        line.substringFind((x) => parse(x).hasNumber(), 'rtl') ?? ''
      ).extractNumbers();
      return parseInt(`${first ?? last}${last ?? first}`);
    })
    .sum();
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
