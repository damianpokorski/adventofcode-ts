import '../utils';
import { initialize } from '../utils/registry';
initialize(__filename, async (part, input, opts) => {
  const raw = input.join('').split(',').fromStringToNumberArray();

  const compute = (digits: number[], noun: number, verb: number) => {
    digits[1] = noun;
    digits[2] = verb;
    for (let i = 0; i < digits.length; i += 4) {
      const [opCode, a, b, c] = [digits[i], digits[i + 1], digits[i + 2], digits[i + 3]];
      if (opCode == 1) {
        digits[c] = digits[a] + digits[b];
      } else if (opCode == 2) {
        digits[c] = digits[a] * digits[b];
      } else {
        break;
      }
    }

    return digits[0];
  };

  if (part == 1) {
    return compute(raw, opts.isTest ? raw[1] : 12, opts.isTest ? raw[2] : 2);
  }

  if (opts.isTest) {
    return -1;
  }
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (compute([...raw], noun, verb) == 19690720) {
        return 100 * noun + verb;
      }
    }
  }
}).tests(['1,9,10,3,2,3,11,0,99,30,40,50'], 3500, -1);
