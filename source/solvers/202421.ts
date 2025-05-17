import '../utils';
import { Grid, type Vector, allPaths, memoize } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, opts) => {
  const numpad = Grid.fromStrings([`789`, '456', '123', '#0A']);
  const arrows = Grid.fromStrings([`#^A`, '<v>']);

  // Converts route in form of 0,1 0,2 0,3 1,4 to [>,>,>,v]
  const routeToInput = (route: Vector[]) => {
    return [
      ...(route
        .map((v, index) =>
          index > 0
            ? v
                .subtract(route[index - 1])
                .toChar()
                .toLowerCase()
            : null
        )
        .filter((v, index) => index > 0) as string[]),
      'A'
    ];
  };

  // Precompute best paths i.e. 0 - 9 has multiple paths, return only ones that has the same size
  const precomputeGrid = (grid: Grid<string>) => {
    const lookup = new Map(
      grid.asVectors().map(([vector, value]) => [value, vector])
    );
    const bestRoutes = {} as Record<string, Record<string, string[][]>>;
    for (const a of lookup.keys()) {
      for (const b of lookup.keys()) {
        // Create hasmaps if not existed
        bestRoutes[a] = bestRoutes[a] ?? {};

        if (a == b) {
          bestRoutes[a][b] = [['A']];
        } else {
          bestRoutes[a][b] = allPaths(
            grid.array,
            lookup.get(a)!,
            lookup.get(b)!,
            (grid, cell) => cell == '#' || cell == undefined
          ).map(routeToInput);
        }
      }
    }
    return bestRoutes;
  };

  const numpadComputed = precomputeGrid(numpad);
  const arrowsComputed = precomputeGrid(arrows);

  // Solving numpad input & getting best possibilities
  const solveInput = (
    computed: Record<string, Record<string, string[][]>>,
    goal: string[]
  ) => {
    let possibilities = [[]] as string[][];
    // For every character in goal
    for (let i = 0; i < goal.length; i++) {
      possibilities = computed[i == 0 ? 'A' : goal[i - 1]!][goal[i]].flatMap(
        (path) => possibilities.map((pos) => [...pos, ...path])
      );
    }
    return possibilities;
  };

  // Pick best possibilities - memoization makes this way faster
  // Did get some hints for this one from here: https://www.youtube.com/watch?v=dqzAaj589cM
  const fastCachedDepthPossibilitiesCalculation = memoize(
    (arg: { a: string; b: string; depth: number }) => {
      if (arg.depth == 1) {
        return arrowsComputed[arg.a][arg.b][0].length;
      }
      // Find the best path
      return arrowsComputed[arg.a][arg.b]
        .map((seq): number =>
          seq
            .map((b, index) => [index == 0 ? 'A' : seq[index - 1], b])
            .map(([a, b]) =>
              fastCachedDepthPossibilitiesCalculation({
                a,
                b,
                depth: arg.depth - 1
              })
            )
            .sum()
        )
        .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);
    },
    (arg) => Object.values(arg).join('/')
  );

  return input
    .map((row) => {
      const pass1 = solveInput(numpadComputed, row.split('')).map((p) =>
        p.join('')
      );

      let size = Number.POSITIVE_INFINITY;
      for (const combination of pass1) {
        let l = 0;
        for (let i = 0; i < combination.length; i++) {
          l += fastCachedDepthPossibilitiesCalculation({
            a: i == 0 ? 'A' : combination[i - 1],
            b: combination[i],
            depth: part == 1 ? 2 : 25
          });
        }
        size = Math.min(size, l);
      }
      const code = parseInt(row.replace(/\D/g, ''), 10);
      const score = size * code;
      if (opts.verbose) {
        console.log([code, size, score]);
      }
      return score;
    })
    .sum();

  // Old dumb & slow solution, did the job for part 1 though o7
  // // // const pass2 = pass1.map((s) => solveInput(arrowsComputed, s.split('')).map((p) => p.join(''))).flat();
  // // // const pass3 = pass2.map((s) => solveInput(arrowsComputed, s.split('')).map((p) => p.join(''))).flat();
  // // // const size = pass3.reduce((a, b) => Math.min(a, b.length), Number.POSITIVE_INFINITY);
  // // // const code = parseInt(row.replace(/\D/g, ''), 10);
  // // // const score = size * code;
  // // // result += score;
})
  .test(
    1,
    `029A
980A
179A
456A
379A`.split('\n'),
    126384
  )
  .test(
    2,
    `029A
980A
179A
456A
379A`.split('\n'),
    154115708116294
  );
