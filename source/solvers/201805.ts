import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const raw = input[0];
  const reducePolymer = (raw: string) => {
    let state = raw;
    while (true) {
      const polymers = [state[0]!];
      for (let i = 1; i < state.length; i++) {
        // Extract values for readability
        const end = polymers.pop() ?? '';
        const addition = state[i];

        // Logical comparisons, in case of polymers cancelling each other - move forward
        const unitMatch = end.toLowerCase() == addition.toLowerCase();
        const polaritiefDifference = end !== addition;
        if (unitMatch && polaritiefDifference) {
          continue;
        }

        // Otherwise re-add both
        polymers.push(end);
        polymers.push(addition);
      }

      if (state.length == polymers.length) {
        return state.length;
      }
      state = polymers.join('');
    }
  };

  // Reduce polymer as is
  if (part == 1) {
    return reducePolymer(raw);
  }

  // iterate through available units & find the best solution
  const units = Object.values(
    [...new Set(raw.split(''))].groupBy((v) => v.toLowerCase())
  ) as [string, string][];

  return units
    .map(([a, b]) => {
      return reducePolymer(raw.replaceAll(a, '').replaceAll(b, ''));
    })
    .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);
}).tests(`dabAcCaCBAcCcaDA`.split('\n'), 10, 4);
