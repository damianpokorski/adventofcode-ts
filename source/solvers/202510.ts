import '../utils';
import { initialize } from '../utils/registry';

function dec2bin(dec: number) {
  return (dec >>> 0).toString(2);
}

initialize(__filename, async (part, input) => {
  const l = input.map((line): [number, number[], number[]] => {
    const [lights, rest] = line.split('] (');
    const [buttons, joltage] = rest.split(') {');
    const lightStates = lights.split('').slice(1);
    return [
      lightStates
        .map((state) => state == '#')
        .map((state, index) => (state ? 1 << index : 0))
        .sum(),
      buttons.split(') (').map((group) =>
        group
          .split(',')
          .asNumbers()
          .map((toggles) => {
            return 1 << toggles;
          })
          .sum()
      ),
      joltage.replace(')', '').split(',').asNumbers()
    ];
  });

  // 011101
  if (part == 1) {
    let totalInputsRequired = 0;
    for (const [goal, toggles] of l) {
      for (let i = 0; i < toggles.length; i++) {
        const match = toggles.combinations(i).find((combination) => {
          let state = 0;
          for (const toggle of combination) {
            state = state ^ toggle;
          }
          return state == goal;
        });
        if (match !== undefined) {
          // console.log(`${states.join('')}`, match, i);
          totalInputsRequired += i;
          break;
        }
      }
    }
    return totalInputsRequired;
  }
  // console.log(l);
}).tests(
  `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`.split('\n'),
  7
);
