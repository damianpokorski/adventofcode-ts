import { type Arith, init } from 'z3-solver';
import '../utils';
import { initialize } from '../utils/registry';

function dec2bin(dec: number) {
  return (dec >>> 0).toString(2);
}

initialize(__filename, async (part, input) => {
  const l = input.map((line): [number, number[], number[], number[][]] => {
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
      joltage.replace(')', '').split(',').asNumbers(),
      buttons.split(') (').map((group) => group.split(',').asNumbers())
    ];
  });

  let presses = 0;
  if (part == 1) {
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
          presses += i;
          break;
        }
      }
    }
  }

  if (part == 2) {
    const z3 = await init();

    const z3Solution = async (joltages: number[], buttons: number[][]) => {
      const { Int, Optimize } = z3.Context(performance.now().toString());

      // Optimize solver - All lights have to be greater than 0
      const opt = new Optimize();

      // Variable for each button - ensure the conditions remain positive
      const variables = buttons.map((_, index) => {
        const v = Int.const(`btn_${index}`);
        opt.add(v.ge(0));
        return v;
      });

      // Create conditional that links buttons to relevant sums
      for (let j = 0; j < joltages.length; j++) {
        let condition: Arith<string> = Int.val(0);
        for (let b = 0; b < buttons.length; b++) {
          if (buttons[b].includes(j)) {
            condition = condition.add(variables[b]);
          }
        }
        opt.add(condition.eq(Int.val(joltages[j])));
      }

      // Optimize for sum of button preses to be minimal
      const sum = variables.reduce((arith, val) => arith.add(val), Int.val(0));
      opt.minimize(sum);

      if ((await opt.check()) == 'sat') {
        return parseInt(opt.model().eval(sum).toString(), 10);
      }
      return 0;
    };
    for (const [_, __, joltages, buttons] of l) {
      presses += await z3Solution(joltages, buttons);
    }
  }
  return presses;
  // console.log(l);
}).tests(
  `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`.split('\n'),
  7,
  33
);
