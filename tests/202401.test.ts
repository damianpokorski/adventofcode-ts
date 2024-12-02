import * as puzzles from '../source/index';

const data = `3   4
4   3
2   5
1   3
3   9
3   3`.split('\n');
const year = 2024;
const day = 1;

describe('2024/01', () => {
  const part1 = (data: string[]) => puzzles.execute(year, day, 1, data);
  const part2 = (data: string[]) => puzzles.execute(year, day, 2, data);

  it('Part 1', async function () {
    const result = await part1(data);
    expect(result).toEqual('11');
  });
  it('Part 2', async function () {
    const result = await part2(data);
    expect(result).toEqual('31');
  });
});
