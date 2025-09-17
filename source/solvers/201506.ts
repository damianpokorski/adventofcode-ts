import '../utils';
import { Grid, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Parse input
  const regex =
    /(turn on|turn off|toggle) ([\d]+),([\d]+) through ([\d]+),([\d]+)/gm;
  const instructions = input.map((line) => {
    const [_, mode, x1, y1, x2, y2] = [...line.matchAll(regex)][0];
    return {
      mode,
      a: new Vector(parseInt(x1.toString(), 10), parseInt(y1.toString(), 10)),
      b: new Vector(parseInt(x2.toString(), 10), parseInt(y2.toString(), 10))
    };
  });
  // Create grid
  const grid = Grid.createAndFill<number>(1000, 1000, () => 0);

  // Fill as per instructions
  for (const { mode, a, b } of instructions) {
    const min = a.min(b);
    const max = b.max(b);
    for (let x = min.x; x <= max.x; x++) {
      for (let y = min.y; y <= max.y; y++) {
        // I could make it mode concise with ternacies, but it'd be an unreadable nightmare
        if (part == 1) {
          switch (mode) {
            case 'turn on':
              grid.set(x, y, 1);
              break;
            case 'turn off':
              grid.set(x, y, 0);
              break;
            case 'toggle':
              grid.set(x, y, grid.get(x, y) == 0 ? 1 : 0);
              break;
          }
        } else {
          switch (mode) {
            case 'turn on':
              grid.set(x, y, grid.get(x, y) + 1);
              break;
            case 'turn off':
              grid.set(x, y, Math.max(grid.get(x, y) - 1, 0));
              break;
            case 'toggle':
              grid.set(x, y, grid.get(x, y) + 2);
              break;
          }
        }
      }
    }
  }

  return grid.iterate().reduce((total, [_, value]) => total + value, 0);
}).tests(
  [
    'turn on 0,0 through 999,999',
    'toggle 0,0 through 999,0',
    'turn off 499,499 through 500,500'
  ],
  998996,
  1001996
);
