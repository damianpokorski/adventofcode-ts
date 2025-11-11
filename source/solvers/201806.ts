import '../utils';
import { alphabet, Grid, Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, options) => {
  const part2maxDistance = options.isTest ? 32 : 10000;
  // Parse input
  const locations = input.map(
    (line) => line.split(', ').fromStringToNumberArray() as [number, number]
  );
  const locationVectors = Vector.fromTuples(locations);

  // Build grid
  const [maxX, maxY] = [
    Math.max(...locations.map(([x, _]) => x)) + 2,
    Math.max(...locations.map(([_, y]) => y)) + 2
  ];

  const grid = Grid.createAndFill(maxX, maxY, () => '.' as string);

  for (const [vector, _] of grid.iterate()) {
    // Calculate distances between points
    const distances = locationVectors.map(
      (location) =>
        [location, vector.gridDistance(location)] as [Vector, number]
    );

    // Part 1 - Find nearest point, using manhattan distance - exclude cases where multiple have same distance
    if (part == 1) {
      const nearest = Math.min(...distances.map(([_, distance]) => distance));
      const nearestPositions = distances.filter(
        ([_, distance]) => distance == nearest
      );
      // If there's no duplicate closest entries
      if (nearestPositions.length == 1) {
        const [nearestLocation, distance] = nearestPositions[0];
        // Bit of a hack, example is using A,B,C when drawing grid - it was useful for debugging to map 0 -> A, 1 -> B etc.
        let value = options.isTest
          ? alphabet[
              locationVectors.findIndex(
                (v) => v.toString() == nearestLocation.toString()
              )
            ].toString()
          : nearestLocation.toString();
        if (distance == 0) {
          value = value.toUpperCase();
        }
        grid.set(vector.x, vector.y, value);
      }
    }
    // Part 2 - Find points which are in range of all points
    if (part == 2) {
      if (distances.map(([_, distance]) => distance).sum() < part2maxDistance) {
        grid.set(vector.x, vector.y, '#');
      }
    }
  }

  // Draw grids
  if (options.isTest && options.verbose) {
    grid.log();
  }

  if (part == 1) {
    const edgeReachingHashes = grid
      .asVectors()
      .filter(([vector, _]) => grid.isEdge(vector))
      .map(([_, value]) => value)
      .distinct();

    // Excluding fills that go out of bounds - find a biggest region in the middle that will no longer expand
    return Math.max(
      ...grid
        .asVectors()
        .map(([_, value]) => value.toLowerCase())
        .filter((value) => value !== '')
        .groupByToEntries((x) => x)
        .map(([key, items]) => [key, items.length] as [string, number])
        .filter(([key, _]) => edgeReachingHashes.includes(key) == false)
        .map(([_, occurrences]) => occurrences)
    );
  }

  // Part 2 - Find biggest entry in the middle
  return grid.filter((cell) => cell == '#').length;
}).tests(
  `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`.split('\n'),
  17,
  16
);
