import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const table = input.map((row) => row.split(''));
  const cell = (y: number, x: number) => (table[y] && table[y][x] ? table[y][x] : '');

  // Part 1
  const slices = [] as string[];
  for (let y = 0; y < table.length; y++) {
    for (let x = 0; x < table[y].length; x++) {
      // Horizontals
      slices.push(table[y].slice(x, x + 4).join(''));
      // Verticals
      slices.push([cell(y, x), cell(y + 1, x), cell(y + 2, x), cell(y + 3, x)].join(''));
      // LR Diagonals
      slices.push([cell(y, x), cell(y + 1, x + 1), cell(y + 2, x + 2), cell(y + 3, x + 3)].join(''));
      // RL Diagonals
      slices.push([cell(y, x), cell(y + 1, x - 1), cell(y + 2, x - 2), cell(y + 3, x - 3)].join(''));
    }
  }
  if (part == 1) {
    return slices.filter((slice) => ['XMAS', 'SAMX'].includes(slice)).length;
  }

  // Part 2
  let xmasCounts = 0;
  for (let y = 0; y < table.length; y++) {
    for (let x = 0; x < table[y].length; x++) {
      // We're checking from center just cause it's easier
      const lr = [cell(y - 1, x - 1), cell(y, x), cell(y + 1, x + 1)].join('');
      const rl = [cell(y - 1, x + 1), cell(y, x), cell(y + 1, x - 1)].join('');
      if (['MAS', 'SAM'].includes(lr) && ['MAS', 'SAM'].includes(rl)) {
        xmasCounts++;
      }
    }
  }
  return xmasCounts;
})
  .test(
    1,
    [
      `MMMSXXMASM`,
      `MSAMXMSMSA`,
      `AMXSXMAAMM`,
      `MSAMASMSMX`,
      `XMASAMXAMM`,
      `XXAMMXXAMA`,
      `SMSMSASXSS`,
      `SAXAMASAAA`,
      `MAMMMXMMMM`,
      `MXMXAXMASX`
    ],
    '18'
  )
  .test(
    2,
    [
      `.M.S......`,
      `..A..MSMS.`,
      `.M.S.MAA..`,
      `..A.ASMSM.`,
      `.M.S.M....`,
      `..........`,
      `S.S.S.S.S.`,
      `.A.A.A.A..`,
      `M.M.M.M.M.`,
      `..........`
    ],
    '9'
  );
