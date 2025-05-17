import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  enum Move {
    ROCK = 'A',
    PAPER = 'B',
    SCISSOR = 'C'
  }
  // 2D Map - [Player1][Player2]: PointsForPlayer1, 8 - Win, 3, Tie, 0 - Loss
  const breakdown = {
    [Move.ROCK]: {
      [Move.SCISSOR]: 6,
      [Move.ROCK]: 3,
      [Move.PAPER]: 0
    },
    [Move.PAPER]: {
      [Move.ROCK]: 6,
      [Move.PAPER]: 3,
      [Move.SCISSOR]: 0
    },
    [Move.SCISSOR]: {
      [Move.PAPER]: 6,
      [Move.SCISSOR]: 3,
      [Move.ROCK]: 0
    }
  };

  const abcToMove = (value: string) =>
    ({ A: Move.ROCK, B: Move.PAPER, C: Move.SCISSOR })[value]!;

  return (
    input
      .map((line) => line.split(' '))
      .map(([other, me]) => {
        const otherMove = abcToMove(other);
        // Part 1: Convert XYZ to ABC
        if (part == 1) {
          me = { X: 'A', Y: 'B', Z: 'C' }[me]!;
        }

        // Part 2: Change move based on the required outcome, X means opponent wins, Y tie, Z we win
        if (part == 2) {
          const expectedScore =
            {
              X: 6,
              Y: 3,
              Z: 0
            }[me] ?? 0;

          me = Object.entries(breakdown[abcToMove(other)]).find(
            ([_, value]) => value == expectedScore
          )![0];
        }

        // Convert ABCs to move Tuples
        return [abcToMove(other), abcToMove(me)] as [Move, Move];
      })
      // Tally up points using breakdown table
      .map(
        ([other, me]) =>
          breakdown[me][other] +
          { [Move.ROCK]: 1, [Move.PAPER]: 2, [Move.SCISSOR]: 3 }[me]
      )
      .sum()
  );
}).tests(
  `A Y
B X
C Z`.split('\n'),
  15,
  12
);
