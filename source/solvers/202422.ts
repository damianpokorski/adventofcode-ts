import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const mix = (n: number, m: number) => n ^ m;
  const prune = (n: number) => n & 0xffffff;
  const mixAndPrune = (n: number, m: number) => prune(mix(n, m));

  // Having some fun with bitshifts :) becaues numbers we user are powers of 2
  // Bitshift left by 6 = Same as multipling by 64
  // Bitshift right by 5 = Same as dividing by 32
  // Bitshift left by 11 = Same as multipling by 2048
  const rand = (initial: number) => {
    const first = mixAndPrune(initial, initial << 6);
    const second = mixAndPrune(first, first >> 5);
    const final = mixAndPrune(second, second << 11);
    return final;
  };

  const randX = (initial: number, passes = 1) => {
    let secret = initial;
    for (let i = 0; i < passes; i++) {
      secret = rand(secret);
    }
    return secret;
  };

  if (part == 1) {
    return input.map((secret) => randX(parseInt(secret), 2000)).sum();
  }

  // Summary of price results based on sliding window, string is a combination of last 4 difs
  const bestPrices = new Map<string, number[]>();

  for (let secret of input.map((s) => parseInt(s))) {
    const diffs = [];
    const previousSales = new Set<string>();

    for (let i = 1; i < 2000; i++) {
      const next = rand(secret);
      // Calculate the diff
      diffs.push((next % 10) - (secret % 10));
      // Store the results for each sliding window of diffs
      if (diffs.length == 4) {
        const hash = diffs.join(',');

        if (!previousSales.has(hash)) {
          // Create entry for hashes if it's the first sale ever
          if (!bestPrices.has(hash)) {
            bestPrices.set(hash, []);
          }
          bestPrices.get(hash)!.push(next % 10);

          // If we have encountered a diff before, we cant use the follow up price as monkey would bid on first occurance
          previousSales.add(hash);
        }

        // We only care about last 4 diffs
        diffs.shift();
      }

      secret = next;
    }
  }

  return bestPrices
    .values()
    .map((prices) => prices.sum())
    .toArray()
    .reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY);
})
  .test(
    1,
    `1
10
100
2024`.split('\n'),

    37327623
  )
  .test(
    2,
    `1
2
3
2024`.split('\n'),
    23
  );
