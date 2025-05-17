import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return input
    .join('\n')
    .split('\n\n')
    .filter((section) => section.includes('\n'))
    .map((game) => {
      // console.log({ game });
      const [[x1, y1], [x2, y2], [x3, y3]] = game.split('\n').map((row) =>
        row
          .replaceAll('=', '')
          .split(': X')
          .pop()
          ?.split('Y')
          .map((x) => parseInt(x))
      ) as [[number, number], [number, number], [number, number]];
      const [a, b, prize] = [
        new Vector(x1, y1),
        new Vector(x2, y2),
        new Vector(x3, y3)
      ];

      if (part == 1) {
        const minAs = prize.divide(a).floor();
        const minBs = prize.divide(b).floor();
        const minOps = Math.max(
          Math.min(minAs.x, minAs.y, minBs.x, minBs.y),
          1
        );
        const maxOps = Math.min(
          Math.max(minAs.x, minAs.y, minBs.x, minBs.y),
          100
        );

        const combinations: [number, number][] = [];

        // Try combinations between min ops -> max (101), if combination is val
        for (let aPresses = 0; aPresses <= maxOps; aPresses++) {
          const aMul = new Vector(aPresses, aPresses);
          const aPos = a.multiply(aMul);
          // const b1 = b.multiply(aMul);
          for (let bPresses = 0; bPresses <= maxOps; bPresses++) {
            if (aPresses + bPresses < minOps) {
              continue;
            }
            const bMul = new Vector(bPresses, bPresses);
            // A - B test
            if (aPos.add(b.multiply(bMul)).equals(prize)) {
              combinations.push([aPresses, bPresses]);
            }
          }
        }
        return (
          combinations
            .map(([a, b]) => a * 3 + b * 1)
            .sort()
            .shift() ?? 0
        );
      }

      // Add the miscalculation
      prize.x += 10000000000000;
      prize.y += 10000000000000;
      // Using algebra - finding out the intersection of two lines
      // Might need to rebrush up on the topic, https://www.youtube.com/watch?v=-5J-DAsWuJc has a great disassemly of the issues
      const aPresses =
        (prize.x * b.y - prize.y * b.x) / (a.x * b.y - a.y * b.x);
      const bPresses = (prize.x - a.x * aPresses) / b.x;
      // Just in case this comes back against next year, offloaded it into a helper fn :|
      //const [aPresses, bPresses] = a.findIntersectionFrequency(b, prize);
      if (aPresses % 1 == 0 && bPresses % 1 == 0) {
        return aPresses * 3 + bPresses * 1;
      }

      return 0;
    })
    .sum();
})
  .test(
    1,
    `Button A: X+94, Y+34
  Button B: X+22, Y+67
  Prize: X=8400, Y=5400

  Button A: X+26, Y+66
  Button B: X+67, Y+21
  Prize: X=12748, Y=12176

  Button A: X+17, Y+86
  Button B: X+84, Y+37
  Prize: X=7870, Y=6450

  Button A: X+69, Y+23
  Button B: X+27, Y+71
  Prize: X=18641, Y=10279`.split('\n'),
    480
  )
  .test(
    2,
    `Button A: X+94, Y+34
  Button B: X+22, Y+67
  Prize: X=8400, Y=5400

  Button A: X+26, Y+66
  Button B: X+67, Y+21
  Prize: X=12748, Y=12176

  Button A: X+17, Y+86
  Button B: X+84, Y+37
  Prize: X=7870, Y=6450

  Button A: X+69, Y+23
  Button B: X+27, Y+71
  Prize: X=18641, Y=10279`.split('\n'),
    875318608908
  );
