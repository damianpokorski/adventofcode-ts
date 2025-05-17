import '../utils';
import { Grid } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const [drawsRaw, ...boardsRaw] = input
    .join('\n')
    .replace(/ +/g, ' ')
    .split('\n\n');
  const draws = drawsRaw.split(',').fromStringToNumberArray();
  const boards = boardsRaw
    .map(
      (b) =>
        new Grid(
          b
            .split('\n')
            .map((line) => line.trim().split(' ').fromStringToNumberArray())
        )
    )
    .map((grid, id) => ({
      id,
      grid,
      gridTransposed: grid.transpose(),
      unchecked: grid.array.flat(),
      isCompleted: false,
      score: 0
    }));

  while (true) {
    const draw = draws.shift();
    if (draw == undefined || boards.every((board) => board.isCompleted)) {
      break;
    }
    for (const board of boards) {
      if (board.isCompleted) {
        continue;
      }
      if (board.unchecked.includes(draw)) {
        // Find the cell location and blank it
        for (const [v, cell] of board.grid.asVectors()) {
          if (draw == cell) {
            board.grid.array[v.y][v.x] = -1;
          }
        }

        // Check for bingo
        if (
          // Rows
          board.grid.array.some((row) => row.every((cell) => cell == -1)) ||
          // Columns
          board.grid
            .transpose()
            .array.some((row) => row.every((cell) => cell == -1)) ||
          // Diagonals
          [0, 1, 2, 3, 4]
            .map((x) => board.grid.array[x][x])
            .every((cell) => cell == -1) ||
          [0, 1, 2, 3, 4]
            .map((x) => board.grid.transpose().array[x][x])
            .every((cell) => cell == -1)
        ) {
          board.isCompleted = true;
          board.score =
            board.grid.array
              .flat()
              .filter((cell) => cell != -1)
              .sum() * draw;
          if (part == 1) {
            return board.score;
          }
          if (part == 2 && boards.every((b) => b.isCompleted)) {
            return board.score;
          }
        }
      }
    }
  }
}).tests(
  `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`.split('\n'),
  4512,
  1924
);
