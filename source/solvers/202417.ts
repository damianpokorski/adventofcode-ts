import '../utils';
import { initialize, Options } from '../utils/registry';

initialize(__filename, async (part, input, opts: Options) => {
  const [registers, program] = input
    .join('\n')
    .massReplace({
      'Register ': '',
      'A: ': '',
      'B: ': '',
      'C: ': '',
      'Program: ': '',
      ',': '\n'
    })
    .split('\n\n')
    .map((raw) => raw.split('\n').map((str) => parseInt(str)));

  if (opts.verbose) {
    console.log({ registers, program });
  }

  let jumped = false;
  let instructionPointer = 0;
  const output = [] as number[];

  const combo = (value: number) => {
    switch (value) {
      case 0:
      case 1:
      case 2:
      case 3:
        return value;
      case 4:
        return registers[0];
      case 5:
        return registers[1];
      case 6:
        return registers[2];
    }
    throw new Error('Encountered 7!');
  };
  const opcodes = {
    0: (operand: number) => {
      registers[0] = Math.floor(registers[0] / Math.pow(2, combo(operand)));
    },
    1: (operand: number) => {
      registers[1] = registers[1] ^ operand;
    },
    2: (operand: number) => {
      registers[1] = combo(operand) % 8;
    },
    3: (operand: number) => {
      if (registers[0] == 0) {
        return;
      }

      if (instructionPointer !== operand) {
        jumped = true;
        instructionPointer = operand;
      }
    },
    4: () => {
      registers[1] = registers[1] ^ registers[2];
    },
    5: (operand: number) => {
      output.push(combo(operand) % 8);
    },
    6: (operand: number) => {
      registers[1] = Math.floor(registers[0] / Math.pow(2, combo(operand)));
    },
    7: (operand: number) => {
      registers[2] = Math.floor(registers[0] / Math.pow(2, combo(operand)));
    }
  } as Record<number, (v: number) => void>;

  // Operate
  while (program[instructionPointer] !== undefined && program[instructionPointer + 1] !== undefined) {
    const instruction = program[instructionPointer];
    const operand = program[instructionPointer + 1];
    if (opts.verbose) {
      console.log(`I: ${instruction}, O: ${operand}`);
      console.log(`A:${registers[0]}, B:${registers[1]} C:${registers[2]}`);
      console.log(`---`);
    }
    jumped = false;

    // Run the operand
    opcodes[instruction](operand);
    if (jumped == false) {
      instructionPointer += 2;
    }
  }

  if (opts.verbose) {
    console.log(`A:${registers[0]}, B:${registers[1]} C:${registers[2]}`);
    console.log(`Output: ${output.join(',')}`);
  }

  return output.join(',');
})
  // .test(
  //   1,
  //   `Register A: 729
  //   Register B: 0
  //   Register C: 0

  //   Program: 0,1,5,4,3,0`.split('\n'),
  //   '4,6,3,5,6,3,5,2,1,0'
  // );
  // .test(
  //   1,
  //   `Register A: 10
  // Register B: 0
  // Register C: 0

  // Program: 5,0,5,1,5,4`.split('\n'),
  //   '0,1,2'
  // );
  .test(
    1,
    `Register A: 2024
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`.split('\n'),
    '4,2,5,6,7,7,7,7,3,1,0'
  );
//   .test(
//     1,
//     `Register A: 729
// Register B: 0
// Register C: 0

// Program: 0,1,5,4,3,0`.split('\n'),
//     '4,6,3,5,6,3,5,2,1,0'
//   );
// .test(2, ``.split('\n'), 0);
