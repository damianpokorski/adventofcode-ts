import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const priority = [
    ...'abcdefghijklmnopqrstuvwxyz'.split(''),
    ...'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')
  ];

  // Part 1, find shared sections between left & right
  if (part == 1) {
    return input
      .map((line) => [
        line.slice(0, Math.floor(line.length / 2)),
        line.slice(Math.floor(line.length / 2))
      ])
      .map((compartments) => compartments.map((comp) => comp.split('')))
      .map(
        ([first, second]) =>
          first.find((item) => second.includes(item)) as string
      )
      .map((sharedItem) => priority.indexOf(sharedItem) + 1)
      .sum();
  }

  // Part 2, find shared sections between each three lines
  return input
    .map((line, index, lines) =>
      index % 3 == 0 ? [lines[index], lines[index + 1], lines[index + 2]] : []
    )
    .filter((set) => set.length > 0)
    .map((set) => set.map((line) => line.split('')))
    .map(
      ([first, second, third]) =>
        first
          .filter((item) => second.includes(item))
          .find((item) => third.includes(item)) as string
    )
    .map((sharedItem) => priority.indexOf(sharedItem) + 1)
    .sum();
}).tests(
  `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`.split('\n'),
  157,
  70
);
