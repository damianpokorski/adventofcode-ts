import * as puzzles from '../source/index';

const data = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`.split('\n');
const year = 2024;
const day = 2;

describe('2024/02', () => {
  const part1 = (data: string[]) => puzzles.execute(year, day, 1, data);
  const part2 = (data: string[]) => puzzles.execute(year, day, 2, data);

  it('Part 1', async function () {
    expect(await part1(data)).toEqual('2');
  });

  it('Part 2', async function () {
    expect(await part2(data)).toEqual('4');
  });
});
