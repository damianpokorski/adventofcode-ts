import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const [stacksInput, movesInput] = input.join('\n').split('\n\n');

  const [stackNamesRaw, ...stacksRaw] = stacksInput.split('\n').reverse();
  const stackNames = stackNamesRaw
    .split('   ')
    .join(' ')
    .split(' ')
    .filter((x) => x !== '');

  const stacks = stackNames
    .map((name) => ({ [name as string]: [] as string[] }))
    .reduce((a, b) => ({ ...a, ...b }));

  for (const row of stacksRaw) {
    for (let i = 0; i < stackNames.length; i++) {
      const stack = stackNames[i];
      const nextItem = row[1 + i * 4];
      if (nextItem == ' ') {
        continue;
      }
      stacks[stack].push(nextItem);
    }
  }
  // console.log({ stackNames, stacksInput, movesInput, stacks });

  const moves = movesInput
    .split('\n')
    .map((line) =>
      line
        .replaceAll(/(move| from | to )/g, ' ')
        .trim()
        .split(' ')
        .map((x) => parseInt(x, 10))
    )
    .map(([count, from, to]) => ({
      count,
      from: from.toString(),
      to: to.toString()
    }));

  for (const move of moves) {
    const items = [] as string[];
    for (let i = 0; i < move.count; i++) {
      const item = stacks[move.from].pop();
      if (item !== undefined) {
        items.push(item);
      }
    }
    // Part 1 - Crane moves stacks First in first out (Hanoi tower style), Part 2 - Move number of items without changing order
    stacks[move.to].push(...(part == 1 ? items : items.reverse()));
  }
  return Object.values(stacks)
    .map((stack) => stack[stack.length - 1])
    .join('');
}).tests(
  `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`.split('\n'),
  'CMZ',
  'MCD'
);
