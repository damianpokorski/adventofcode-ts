import '../utils';
import { initialize, Options } from '../utils/registry';

initialize(__filename, async (part, input, opts: Options) => {
  const [rawRegisters, rawProgram] = input
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
    .map((raw) => raw.split('\n').map((str) => BigInt(parseInt(str))));

  if (opts.verbose) {
    console.log({ rawRegisters, rawProgram });
  }

  const execute = (a: bigint, b: bigint, c: bigint, program: bigint[]) => {
    const registers = [a, b, c];
    let jumped = false;
    let instructionPointer = 0;
    const output = [] as bigint[];

    const combo = (value: bigint) => {
      switch (value) {
        case 0n:
        case 1n:
        case 2n:
        case 3n:
          return value;
        case 4n:
          return registers[0];
        case 5n:
          return registers[1];
        case 6n:
          return registers[2];
      }
      throw new Error('Encountered 7!');
    };
    const opcodes = {
      0: (operand: bigint) => {
        registers[0] = registers[0] >> combo(operand);
      },
      1: (operand: bigint) => {
        registers[1] = registers[1] ^ operand;
      },
      2: (operand: bigint) => {
        registers[1] = combo(operand) & 7n;
      },
      3: (operand: bigint) => {
        if (registers[0] == 0n) {
          return;
        }

        if (instructionPointer !== Number(operand)) {
          jumped = true;
          instructionPointer = Number(operand);
        }
      },
      4: () => {
        registers[1] = registers[1] ^ registers[2];
      },
      5: (operand: bigint) => {
        output.push(combo(operand) & 7n);
      },
      6: (operand: bigint) => {
        registers[1] = registers[0] >> combo(operand);
      },
      7: (operand: bigint) => {
        registers[2] = registers[0] >> combo(operand);
      }
    } as Record<number, (v: bigint) => void>;

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
      opcodes[Number(instruction)](operand);
      if (jumped == false) {
        instructionPointer += 2;
      }
    }

    if (opts.verbose) {
      console.log(`A:${registers[0]}, B:${registers[1]} C:${registers[2]}`);
      console.log(`Output: ${output.join(',')}`);
    }

    return output;
  };

  if (part == 1) {
    return execute(rawRegisters[0], rawRegisters[1], rawRegisters[2], rawProgram).join(',');
  }

  // Thanks to observations from
  // https://www.reddit.com/r/adventofcode/comments/1hg38ah/2024_day_17_solutions/
  // + https://www.reddit.com/r/adventofcode/comments/1hg38ah/comment/m2ghcso/
  // ^ Above made me convert all number to BigInt (cause typescript is poop), which made it actually possible for me to implement hints in the thread :<
  // The generated program tends to heavily rely on last 3 bits of A
  // Meaning we can keep iterating through numbers by shifting left by 3
  // Once we find the valid position for nth bit code of program we can recurse down to next digit and so forth
  const findInitialA = (nextVal = 0n, i = rawProgram.length - 1): bigint => {
    if (i < 0) return nextVal;
    for (let aVal = nextVal << 3n; aVal < (nextVal << 3n) + 8n; aVal++) {
      rawRegisters[0] = aVal;
      const out = execute(rawRegisters[0], rawRegisters[1], rawRegisters[2], rawProgram);
      if (out[0] === rawProgram[i]) {
        const finalVal = findInitialA(aVal, i - 1);
        if (finalVal >= 0) return finalVal;
      }
    }
    return -1n;
  };
  return findInitialA().toString();
})
  .test(
    1,
    `Register A: 2024
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`.split('\n'),
    '4,2,5,6,7,7,7,7,3,1,0'
  )
  .test(
    2,
    `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`.split('\n'),
    117440
  );
