import '../utils';
import { initialize } from '../utils/registry';
const testData = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`.split('\n');
initialize(__filename, async (part, input) => {
  const lookup = {} as Record<
    string,
    Record<
      string,
      {
        offset: number;
        source: {
          start: number;
          end: number;
        };
        destination: {
          start: number;
          end: number;
        };
      }[]
    >
  >;
  let seeds: number[] = [];
  const groups = input
    .join('\n')
    .split('\n\n')
    .map((group) => {
      const [label, itemsRaw] = group.replace(' map', '').split(':');
      const items = itemsRaw.trim().split('\n');
      const [source, destination] = label.split('-to-');

      if (source == 'seeds') {
        seeds = itemsRaw
          .trim()
          .split(' ')
          .map((x) => parseInt(x, 10));
        return;
      }

      // Insert stacks
      lookup[source] = lookup[source] ? lookup[source] : {};
      lookup[source][destination] = lookup[source][destination] ? lookup[source][destination] : [];

      const ranges = items.map((row) => {
        const [destinationStart, sourceStart, range] = row.split(' ');
        // Destination processing
        if (destination) {
          lookup[source][destination].push({
            offset: parseInt(destinationStart, 10) - parseInt(sourceStart, 10),
            source: {
              start: parseInt(sourceStart, 10),
              end: parseInt(sourceStart, 10) + parseInt(range, 10) - 1
            },
            destination: {
              start: parseInt(destinationStart, 10),
              end: parseInt(destinationStart, 10) + parseInt(range, 10) - 1
            }
          });
        }
      });
    });

  let minSeed = Infinity;
  let minLocation = Infinity;
  const path = ['seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location'];

  for (const seed of seeds) {
    let value = seed;
    for (let pathIndex = 0; pathIndex < path.length - 1; pathIndex++) {
      const [source, destination] = [path[pathIndex], path[pathIndex + 1]];

      const { offset } = lookup[source][destination].find(
        (range) => range.source.start <= value && range.source.end >= value
      ) ?? { offset: 0 };
      const end = value + offset;
      value = end;
      if (destination == 'location' && minLocation > end) {
        minLocation = end;
        minSeed = seed;
      }
    }
  }
  if (part == 1) {
    return minLocation;
  }

  // Part 2
  const seedPairs = seeds.reduce(function (result, value, index, array) {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, [] as number[][]);

  for (const [seedStart, rangeSize] of seedPairs) {
    console.log({ seedStart, rangeSize });
    for (let range = 0; range < rangeSize; range++) {
      const seed = seedStart + range;
      let value = seed;
      // Ticker
      if (seed % 100000 == 0) {
        console.log(`[Tick ${seedStart} / ${seed} ${range / rangeSize}`);
      }
      for (let pathIndex = 0; pathIndex < path.length - 1; pathIndex++) {
        // Logic
        const [source, destination] = [path[pathIndex], path[pathIndex + 1]];
        const { offset } = lookup[source][destination].find(
          (range) => range.source.start <= value && range.source.end >= value
        ) ?? { offset: 0 };
        const end = value + offset;
        value = end;
        if (destination == 'location' && minLocation > end) {
          minLocation = end;
          minSeed = seed;
        }
      }
    }
  }

  return minLocation;
})
  .test(1, testData, 35)
  .test(2, testData, 46);
