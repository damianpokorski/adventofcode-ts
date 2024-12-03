import { execute } from '../source';
describe('2024/03', () => {
  const part1 = (data: string[]) => execute(2024, 3, 1, data);
  const part2 = (data: string[]) => execute(2024, 3, 2, data);

  it('Part 1', async function () {
    expect(await part1([`xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`])).toEqual('161');
  });

  it('Part 2', async function () {
    expect(await part2([`xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`])).toEqual('48');
  });
});
