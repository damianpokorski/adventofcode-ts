import '../utils';
import { Grid, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const parsedInput = input
    .map((line) => line.replaceAll(/[#@:]/g, '').replaceAll(/\s+/g, ' ').split(' '))
    .map(([id, xy, wh]) => {
      const [x, y] = xy.split(',').fromStringToNumberArray();
      const [w, h] = wh.split('x').fromStringToNumberArray();
      const cells = [] as Vector[];

      for (let _w = 0; _w < w; _w++) {
        for (let _h = 0; _h < h; _h++) {
          cells.push(new Vector(x + _w, y + _h));
        }
      }
      return { id, x, y, w, h, cells };
    });

  // Build grid, fill in all the cells with ids
  const grid = Grid.createAndFill<string[]>(1000, 1000, () => [] as string[]);
  for (const suggestion of parsedInput) {
    for (const cell of suggestion.cells) {
      grid.array[cell.x][cell.y]!.push(suggestion.id);
    }
  }

  // Filter out - only squares that are references multiple times
  if (part == 1) {
    return grid.asVectors().filter(([_, ids]) => ids !== null && ids.length > 1).length;
  }

  // Start with all entries & remove ids if they're part of overlapping cell
  const set = new Set(parsedInput.map((x) => x.id));
  for (const [_, ids] of grid.asVectors().filter(([_, ids]) => ids.length > 1)) {
    for (const id of ids) {
      set.delete(id);
    }
  }
  return set.entries().toArray().flat().distinct().pop();
}).tests(
  `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`.split('\n'),
  4,
  3
);
