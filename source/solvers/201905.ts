import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const raw = input.join('').split(',').asNumbers();

  const compute = (memory: number[], input: number) => {
    const outputBuffer: number[] = [];
    for (let i = 0; i < memory.length; ) {
      let [opCode, param1raw, param2raw, param3] = [
        memory[i],
        memory[i + 1],
        memory[i + 2],
        memory[i + 3]
      ];

      // Parse 4 digit opcode encoding
      const [modeParam3, modeParam2, modeParam1, opCodeLeft, opCodeRight] =
        opCode.toString().padStart(5, '0').split('').asNumbers();
      opCode = parseInt(`${opCodeLeft}${opCodeRight}`);

      const getMemory = (value: number, mode: number) =>
        mode == 0 ? memory[value] : value;

      // Support immediate and position mode
      const param1 = getMemory(param1raw, modeParam1);
      const param2 = getMemory(param2raw, modeParam2);

      // Shift memory pointer based on number of parameters used
      i =
        i +
        ({
          1: 4,
          2: 4,
          3: 2,
          4: 2,
          ...(part == 1
            ? {}
            : {
                5: 0,
                6: 0,
                7: 4,
                8: 4
              })
        }[opCode] ?? 4);

      // Immediate halt
      if (opCode == 99) {
        break;
      }
      // Add, Multiply, Input, Store, Jump if not 0, Jump if 0, LT, EQ
      if (opCode == 1) {
        memory[param3] = param1 + param2;
      } else if (opCode == 2) {
        memory[param3] = param1 * param2;
      } else if (opCode == 3) {
        memory[param1raw] = input;
      } else if (opCode == 4) {
        outputBuffer.push(param1);
      } else {
        if (part == 2) {
          if (opCode == 5) {
            if (param1 !== 0) {
              i = param2;
            } else {
              i += 3;
            }
          } else if (opCode == 6) {
            if (param1 == 0) {
              i = param2;
            } else {
              i += 3;
            }
          } else if (opCode == 7) {
            memory[param3] = param1 < param2 ? 1 : 0;
          } else if (opCode == 8) {
            memory[param3] = param1 == param2 ? 1 : 0;
          }
          continue;
        }
        break;
      }
    }
    return outputBuffer.length == 0 ? 0 : parseInt(outputBuffer.join(''));
  };

  return compute(raw, part == 1 ? 1 : 5);
})
  .test(1, `3,0,4,0,99`.split('\n'), 1)
  .test(
    2,
    `3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`.split('\n'),
    999
  );
