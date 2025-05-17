import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const fuelCalc = (x: number) => Math.floor(x / 3) - 2;
  const recursiveFuelCalc = (x: number): number => {
    const fuelRequired = fuelCalc(x);
    return Math.max(
      0,
      fuelRequired + (fuelRequired > 0 ? recursiveFuelCalc(fuelRequired) : 0)
    );
  };

  return input
    .fromStringToNumberArray()
    .map((x) => (part == 1 ? fuelCalc(x) : recursiveFuelCalc(x)))
    .sum();
}).tests([`1969`, `100756`], 654 + 33583, 966 + 50346);
