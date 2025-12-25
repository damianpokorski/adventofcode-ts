import '../utils';
import { initialize } from '../utils/registry';
import { createProgram } from './201905';

// Refactored intcode processor from 201905

initialize(__filename, async (part, input, { isTest, verbose }) => {
  const memory = input.join('').split(',').asNumbers();
  let max = 0;

  const start = part == 1 ? 0 : 5;
  for (const combination of [].range(start, start + 5).permutations(5)
    .iterator) {
    const ampMemory = [].range(0, 5).map(() => [...memory]);

    // All inputs start with their phase, first entry also starts with 0
    const ampInputs = [
      [combination[0], 0],
      [combination[1]],
      [combination[2]],
      [combination[3]],
      [combination[4]]
    ];
    // Create amplifier programs - using blocking generators
    const amplifiers = [
      createProgram(2)(ampMemory[0], () => ampInputs[0].shift()!),
      createProgram(2)(ampMemory[1], () => ampInputs[1].shift()!),
      createProgram(2)(ampMemory[2], () => ampInputs[2].shift()!),
      createProgram(2)(ampMemory[3], () => ampInputs[3].shift()!),
      createProgram(2)(ampMemory[4], () => ampInputs[4].shift()!)
    ];

    if (part == 1) {
      let input = 0;
      for (let i = 0; i < combination.length; i++) {
        input = amplifiers[i].next().value! as number;
        ampInputs[(i + 1) % ampInputs.length].push(input);
      }
      max = Math.max(input, max);
    } else {
      let completed = false;
      while (!completed) {
        for (let i = 0; i < combination.length; i++) {
          let blocked = false;
          while (!blocked) {
            const { value: result, done } = amplifiers[i].next();
            // Keep going until we're blocked
            if (result == 'BLOCKED') {
              blocked = true;
              break;
            }
            ampInputs[(i + 1) % ampInputs.length].push(result);

            // If we're completed (opcode 99)
            if (done) {
              completed = true;
              break;
            }

            // If we're the last amp - store value
            if (i == combination.length - 1) {
              max = Math.max(result, max);
            }
          }
        }
      }
    }
  }
  return max;
})
  .test(
    1,
    [
      `3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`
    ],
    65210
  )
  .test(
    2,
    [
      `3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`
    ],
    18216
  );
