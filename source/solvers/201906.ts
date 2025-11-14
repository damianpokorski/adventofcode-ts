import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // TODO: Come back and add memoization if I ever want to bring down, ~200ms is somehow acceptable
  const links = input
    .map((line) => line.split(')') as [string, string])
    .map(([center, orbiter]) => ({ [orbiter]: center }))
    .reduce((a, b) => ({ ...a, ...b }));

  const traverse = (start: string) => {
    let jumps = 0;
    let position = `${start}`;

    while (position !== 'COM') {
      position = `${links[position]}`;
      jumps++;
    }
    return jumps;
  };

  if (part == 1) {
    return Object.keys(links)
      .map((node) => traverse(node))
      .sum();
  }

  const path = (start: string, goal: string) => {
    const steps = [] as string[];
    let position = `${start}`;
    while (position !== goal) {
      steps.push(position);
      position = `${links[position]}`;
    }
    return new Set([...steps.reverse()]).values().toArray();
  };
  const a = path('YOU', 'COM');
  const b = path('SAN', 'COM');
  const steps = [
    ...a.filter((nodeA) => b.includes(nodeA) == false),
    ...b.filter((nodeB) => a.includes(nodeB) == false)
  ].filter((node) => ['YOU', 'SAN'].includes(node) == false);

  return steps.length;
}).tests(
  `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`.split('\n'),
  54,
  4
);
