import '../utils';
import { memoize } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const [towels, goals] = input
    .join('\n')
    .replaceAll(', ', '\n')
    .split('\n\n')
    .map((section) => section.split('\n'));

  // Count possibilities
  const possible = memoize(
    function (target: string) {
      if (target == '') return 1;
      let count = 0;
      for (const towel of towels) {
        if (target.startsWith(towel)) {
          count += possible(target.slice(towel.length));
          // For part 1 - just one is enough
          if (part == 1 && count > 0) {
            return 1;
          }
        }
      }
      return count;
    },
    (target) => target
  );

  return goals
    .map((goal) => possible(goal))
    .map((possibilities) => (part == 1 ? (possibilities > 0 ? 1 : 0) : possibilities))
    .sum();
})
  .test(
    1,
    `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`.split('\n'),
    6
  )
  .test(
    2,
    `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`.split('\n'),
    16
  );
