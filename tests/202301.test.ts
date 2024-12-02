import { findUsingFilename } from '../source/index';

describe(`2023/01`, () => {
  const solver = findUsingFilename(__filename);
  it('Part 1', async function () {
    const data = [`1abc2`, `pqr3stu8vwx`, `a1b2c3d4e5f`, `treb7uchet`];
    expect(await solver(1, data)).toEqual('142');
  });
  it('Part 2', async function () {
    const data = [
      `two1nine`,
      `eightwothree`,
      `abcone2threexyz`,
      `xtwone3four`,
      `4nineeightseven2`,
      `zoneight234`,
      `7pqrstsixteen`
    ];
    expect(await solver(2, data)).toEqual('281');
  });
});
