import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const days = part == 1 ? 80 : 256;
  const pool = input
    .join('')
    .split(',')
    .asNumbers()
    .groupBy((value) => value);

  const group = [...new Array(9)].map((_, index) => pool[index]?.length ?? 0);

  for (let i = 0; i < days; i++) {
    // Get number fish that's breeding
    const spawningFish = group.shift()!;
    // Reset their timer by shifting them to 6th group
    group[6] += spawningFish;
    // Spawn new fish
    group.push(spawningFish);
  }

  return group.sum();
}).tests(`3,4,3,1,2`.split('\n'), 5934, 26984457539);
