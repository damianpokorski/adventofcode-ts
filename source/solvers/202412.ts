/* eslint-disable @typescript-eslint/no-unused-vars */
import '../utils';
import { Vector, VectorFacing } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const grid = input.map((row) => row.split(''));

  const floodFill = <T>(vector: Vector, getter: (v: Vector) => T) => {
    const set = [] as Vector[];
    const value = getter(vector);
    // If value is not set - return nothing
    if (value == undefined) {
      return set;
    }
    // Add current node to the set
    set.push(vector);

    while (true) {
      // Expand
      const expands = set
        // -> Filter to adjecent matching values & flatten
        .map((cell) => cell.adjecents().filter((adjecent) => getter(adjecent) == value))
        .flat()
        .distinct((v) => v.hash())
        // -> Ignore ones already in our set
        .filter((cell) => !set.find((knownCell) => knownCell.equals(cell)));

      if (expands.length == 0) {
        break;
      }
      set.push(...expands);
    }
    return set;
  };

  const completed: number[] = [];
  const scores: [number, number] = [0, 0];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const vector = new Vector(x, y);
      const hash = vector.hash();
      // If we've already processed this cell - skip it
      if (completed.includes(hash)) {
        continue;
      }
      // Flood fill from here & mark them as processed
      const section = floodFill(vector, (v) => v.getGridValue(grid));
      completed.push(...section.map((v) => v.hash()));

      const area = section.length;
      // Cheekily figure out the perimeter by expanding each cell by 1, and then excluding all existing fields
      const fencePositions = section
        .map((cell) =>
          cell
            .adjecents()
            .filter((adjecent) => section.find((other) => other.equals(adjecent)) == undefined)
            .map((fence) => [fence, fence.toFacing(cell)] as [Vector, VectorFacing])
        )
        .flat()
        .distinct(([a, b]) => `${a}/${b.toString()}`);

      const perimeter = fencePositions.length;
      let sides = 0;
      if (part == 2) {
        const horizontals = fencePositions
          .filter(([_, facing]) => [VectorFacing.U, VectorFacing.D].includes(facing))
          .groupBy((x) => x[1] + x[0].y.toString());
        const verticals = fencePositions
          .filter(([_, facing]) => [VectorFacing.L, VectorFacing.R].includes(facing))
          .groupBy((x) => x[1] + x[0].x.toString());

        for (const line of [
          ...Object.values(horizontals).map((x) => x.map((v) => v[0].x).sort()),
          ...Object.values(verticals).map((x) => x.map((v) => v[0].y).sort())
        ]) {
          // Count instances that previous value of is not different
          sides +=
            1 +
            line
              .slice(1)
              .map((b, i) => (line[i] + 1 == b ? 0 : 1))
              .sum();
        }
      }

      // // console.log(
      // //   vector.getGridValue(grid),
      // //   `P1:`,
      // //   area,
      // //   '*',
      // //   perimeter,
      // //   area * perimeter,
      // //   'P2: ',
      // //   area,
      // //   '*',
      // //   sides,
      // //   area * sides
      // // );
      if (part == 1) {
        scores.push(area * perimeter);
      } else {
        scores.push(area * sides);
      }
    }
  }
  return scores.sum();
})
  .test(
    1,
    `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`.split('\n'),
    1930
  )
  .test(
    2,
    `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`.split('\n'),
    1206
  );
