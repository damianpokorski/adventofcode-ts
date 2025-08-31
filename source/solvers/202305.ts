import '../utils';
import { debug, info, warn } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const lookup = {} as Record<
    string,
    Record<string, ((input: number) => number | null)[]>
  >;
  let seeds: number[] = [];
  const maps = new Set<string>();

  const makeMapper = (
    from: number,
    destinationStart: number,
    range: number
  ) => {
    info({ from, destinationStart, range, offset: destinationStart - from });
    return (v: number) => {
      if (v >= from && v < from + range) {
        info({ from, destinationStart, range });
        return v + (destinationStart - from);
      }
      return null;
    };
  };

  for (const group of input.join('\n').split('\n\n')) {
    const [label, itemsRaw] = group.replace(' map', '').split(':');
    const items = itemsRaw.trim().split('\n');
    const [source, destination] = label.split('-to-');

    if (source == 'seeds') {
      seeds = itemsRaw
        .trim()
        .split(' ')
        .map((x) => parseInt(x, 10));
      continue;
    }
    maps.add(source);
    maps.add(destination);

    // Build a stack of mappers
    lookup[source] = lookup[source] ? lookup[source] : {};
    lookup[source][destination] = lookup[source][destination]
      ? lookup[source][destination]
      : [];

    for (const row of items) {
      const [to, from, range] = row.split(' ').map((v) => parseInt(v, 10));

      // Destination processing
      info({ source, destination });
      lookup[source][destination].push(makeMapper(from, to, range));
    }
  }

  const convert = (a: string, b: string, n: number) => {
    let result = null;
    for (const mapper of lookup[a][b]) {
      result = mapper(n);
      if (result !== null) {
        break;
      }
    }
    return result == null ? n : result;
  };
  const conversions = [...maps];
  const convertAll = (n: number) => {
    let currentN = n;
    for (let i = 1; i < conversions.length; i++) {
      debug('Before', [conversions[i - 1], conversions[i], currentN]);
      currentN = convert(conversions[i - 1], conversions[i], currentN);
      warn('After', [conversions[i - 1], conversions[i], currentN]);
      debug('--');
    }
    return currentN;
  };
  info(seeds);
  if (part == 1) {
    return seeds
      .map(convertAll)
      .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);
  }

  const seedPairs = seeds.reduce(
    (result, value, index, array) => {
      if (index % 2 === 0)
        result.push(array.slice(index, index + 2) as [number, number]);
      return result;
    },
    [] as [number, number][]
  );

  // for (const [seedStart, rangeSize] of seedPairs) {
  //   for (let range = 0; range < rangeSize; range++) {
  //     const seed = seedStart + range;
  //     let value = seed;
  //     // Ticker
  //     if (seed % 100000 == 0) {
  //       console.log(`[Tick ${seedStart} / ${seed} ${range / rangeSize}`);
  //     }
  //     for (const [source, destination] of maps.values().toArray().pairwise()) {
  //       // Logic
  //       const { offset } =
  //         lookup[source][destination].find(
  //           (range) => range.source.start <= value && range.source.end >= value
  //         ) ?? { offset: 0 }!;
  //       const end = value + offset;
  //       value = end;

  //       if (destination == 'location' && minLocation > end) {
  //         console.log({
  //           msg: 'New seed with min location',
  //           minLocation,
  //           end,
  //           seed
  //         });
  //         minLocation = end;
  //         minSeed = seed;
  //       }
  //     }
  //   }
  // }
}).tests(
  `seeds: 79 14 55 13

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
56 93 4`.split('\n'),
  '35',
  46
);
