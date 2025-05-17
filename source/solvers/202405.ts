import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const [rules, pages] = input
    .join('\n')
    .split('\n\n')
    .map((chunk) =>
      chunk
        .split('\n')
        .map((line) =>
          line
            .split(line.includes(',') ? ',' : '|')
            .map((value) => parseInt(value))
        )
    ) as unknown as [[number, number][], number[][]]; // Force casting cause we know what's there :)

  // Build hashmaps for faster look ups
  const befores = rules.reduce(
    (aggr, [before, after]) => ({
      ...aggr,
      [before]: [after, ...(aggr[before] ?? [])]
    }),
    {} as Record<number, number[]>
  );
  const afters = rules.reduce(
    (aggr, [before, after]) => ({
      ...aggr,
      [after]: [before, ...(aggr[after] ?? [])]
    }),
    {} as Record<number, number[]>
  );

  // I could optimise this with for loops - but hasmaps & sortings are good fast enough for this one
  const sorting = (l: number, r: number) => {
    if (l == r) {
      return 0;
    }
    if (befores[l]?.includes(r) || afters[r]?.includes(l)) {
      return -1;
    }
    if (befores[r]?.includes(l) || afters[l]?.includes(r)) {
      return 1;
    }
    return 0;
  };

  return pages
    .map((page) => {
      const sorted = [...page].sort(sorting);
      const isCorrect = page.every((value, index) => sorted[index] == value);
      if ((part == 1 && isCorrect) || (part == 2 && !isCorrect)) {
        return sorted;
      }
      return undefined;
    })
    .filter((value) => value !== undefined)
    .map((values) => values[Math.floor(values.length / 2)])
    .sum();
})
  .test(
    1,
    `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`.split('\n'),
    143
  )
  .test(
    2,
    `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`.split('\n'),
    123
  );
