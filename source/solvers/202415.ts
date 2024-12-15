import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

const delay = (ms: number) => new Promise((resolve, reject) => setTimeout(() => resolve(undefined), ms));

initialize(__filename, async (part, input, opts) => {
  const [inputGrid, inputMoves] = input.join('\n').split('\n\n');
  const grid = inputGrid
    .split('\n')
    .map((row) => row.split(''))
    .map((row) => {
      if (part == 1) {
        return row;
      }
      return row
        .map(
          (cell) =>
            ({
              '#': '##',
              '.': '..',
              O: '[]',
              '@': '@.'
            })[cell] ?? cell
        )
        .join('')
        .split('');
    });

  const moves = inputMoves.split('').map((move) => Vector.fromChar(move));

  const vectors = grid
    .map((row, y) => row.map((cell, x) => [cell, new Vector(x, y)] as [string, Vector]))
    .flat();

  const swap = (x1: number, y1: number, x2: number, y2: number) => {
    const one = grid[y1][x1];
    grid[y1][x1] = grid[y2][x2];
    grid[y2][x2] = one;
  };

  let robot = vectors.find(([value]) => value == '@')?.[1] as Vector;

  let iteration = 0;
  const log = (move: Vector) => {
    console.clear();
    console.log(`Iteration: #${iteration} Last move ${move?.toChar()}`);
    console.log(`Robot: ${robot}`);
    for (const row of grid) {
      console.log(row.join(''));
    }
    console.log();
    iteration++;
  };

  // // // log(Vector.Zero);
  while (moves.length > 0) {
    const move = moves.shift();
    if (!move) {
      break;
    }
    // Check if robot is facing a box
    const moveTarget = robot.add(move);
    let moveTargetType = moveTarget.getGridValue(grid);
    // Facing a wall, can't do anything
    if (moveTargetType == '#') {
      continue;
    }

    // Facing a box - push it
    if (moveTargetType == 'O' || moveTargetType == '[' || moveTargetType == ']') {
      let isMoveable = false;
      const verticalShifts = [] as Vector[][];
      // Continue checking in that direction until we find a blank spot our are out of bounds
      let nextTarget = moveTarget.copy();
      while (true) {
        nextTarget = nextTarget.add(move);
        const nextTargetType = nextTarget.getGridValue(grid);
        if (nextTargetType == '.') {
          if (part == 2 && move.isVertical()) {
            // Part 2 vertical shifts
            // Grab current box & make it an array
            verticalShifts.push(
              [moveTarget, moveTarget.add(new Vector(moveTargetType == '[' ? 1 : -1, 0))].sort(
                (a, b) => a.x - b.x
              )
            );
            while (true) {
              // Keep moving all of the boxes
              const nextSet = verticalShifts[verticalShifts.length - 1].map((boxes) => boxes.add(move));
              // const nextSetBoxes = nextSet.filter((x) => ['[', ']'].includes(x.getGridValue(grid) ?? ''));
              const nextSetBoxes = [...nextSet];
              // Trim blank spaces around edges - wee don't want to push those, but bits inbetween -yeah
              while (nextSetBoxes.length > 0 && nextSetBoxes[0].getGridValue(grid) == '.') {
                nextSetBoxes.shift();
              }
              while (
                nextSetBoxes.length > 0 &&
                nextSetBoxes[nextSetBoxes.length - 1].getGridValue(grid) == '.'
              ) {
                nextSetBoxes.pop();
              }
              // If we're misaligned, we should expand our pushing section
              if (nextSetBoxes.length > 0) {
                if (nextSetBoxes[0].getGridValue(grid) == ']') {
                  nextSetBoxes.unshift(nextSetBoxes[0].add(new Vector(-1, 0)));
                }
                if (nextSetBoxes[nextSetBoxes.length - 1].getGridValue(grid) == '[') {
                  nextSetBoxes.push(nextSetBoxes[nextSetBoxes.length - 1].add(new Vector(1, 0)));
                }
              }
              // If the next row is full of blanks, we can move!
              if (nextSet.every((x) => x.getGridValue(grid) == '.')) {
                isMoveable = true;
                break;
              }
              // If next row contains a # - we can't move the set, stop here
              if (nextSet.some((x) => x.getGridValue(grid) == '#')) {
                break;
              }
              // Here we know our next set should contain boxes - but we need to to expand if needs be
              verticalShifts.push(nextSetBoxes);
            }
          } else {
            isMoveable = true;
          }
          break;
        }
        if (nextTargetType == '#') {
          break;
        }
      }
      if (isMoveable) {
        if (part == 2) {
          // Part 2 - Horizontal moving - if the move was horizontal, we gotta fix some ][ to [] by swapping them back to correct spots
          if (move.isHorizontal()) {
            while (Math.abs(nextTarget.x - moveTarget.x) !== 1) {
              swap(nextTarget.x, nextTarget.y, nextTarget.x - move.x, nextTarget.y);
              // Swap values one by one
              nextTarget.x -= move.x;
            } // Swap the blank spot with the box
            swap(moveTarget.x, moveTarget.y, nextTarget.x, nextTarget.y);
          } else {
            // Vertical boogalo
            // console.log(`Vertical shifts`);
            // console.log(verticalShifts);
            // Shift all of the boxes starting from the last set
            for (const row of verticalShifts.reverse()) {
              for (const boxPart of row) {
                swap(boxPart.x, boxPart.y, boxPart.x, boxPart.y + move.y);
              }
            }
          }
        } else {
          // Swap the blank spot with the box
          swap(moveTarget.x, moveTarget.y, nextTarget.x, nextTarget.y);
        }
        // We know we're facing a blank now
        moveTargetType = '.';
      }

      if (opts.verbose) {
        log(move);
        await delay(10);
      }
    }

    // A blank spot - move into it
    if (moveTargetType == '.') {
      // Update grid values
      swap(robot.x, robot.y, moveTarget.x, moveTarget.y);
      // Update stored robots position
      robot = moveTarget;
    }
  }
  // log(Vector.Zero);
  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == 'O' || grid[y][x] == '[') {
        sum += y * 100 + x;
      }
    }
  }

  return sum;
})
  .test(
    1,
    `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`.split('\n'),
    10092
  )
  .test(
    2,
    `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`.split('\n'),
    9021
  );
