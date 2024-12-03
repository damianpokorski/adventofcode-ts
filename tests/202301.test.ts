import { findTestUsingFilename, findUsingFilename } from '../source/index';

describe(`2023/01`, () => {
  const solver = findUsingFilename(__filename);

  it('Part 1', async function () {
    const [input, result] = findTestUsingFilename(__filename, 1);
    expect(await solver(1, input)).toEqual(result);
  });
  it('Part 2', async function () {
    const [input, result] = findTestUsingFilename(__filename, 2);
    expect(await solver(2, input)).toEqual(result);
  });
});
