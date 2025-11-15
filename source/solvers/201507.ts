import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, opts) => {
  const execute = (instructions: string[]) => {
    const memory = {} as Record<string, number>;

    const store = (address: string, value: number) => {
      // Typescript defaults to 32 bit values, we can cheat about by using bitwise and as a make when storing values
      memory[address] = value & 0xffff;
      return memory[address];
    };

    const read = (addressOrValue: string) =>
      addressOrValue.isNumber()
        ? parseInt(addressOrValue, 10)
        : memory[addressOrValue];

    // Checks if the value in memory has already been populated
    const ready = (addressOrValue: string) =>
      addressOrValue.isNumber() || memory[addressOrValue] !== undefined;

    // Process instructions into operations
    const operations = instructions.map((line) => {
      const [input, output] = line.split(' -> ');
      const params = input.split(' ');
      // Direct assignment
      if (params.length == 1) {
        const [value] = params;
        return () => (ready(value) ? store(output, read(value)) : null);
      }
      // NOT
      if (params.length == 2 && params[0] == 'NOT') {
        return () =>
          ready(params[1]) ? store(output, ~read(params[1])) : null;
      }
      // AND
      if (params[1] == 'AND') {
        return () =>
          ready(params[0]) && ready(params[2])
            ? store(output, read(params[0]) & read(params[2]))
            : null;
      }
      // OR
      if (params[1] == 'OR') {
        return () =>
          ready(params[0]) && ready(params[2])
            ? store(output, read(params[0]) | read(params[2]))
            : null;
      }
      // LSHIFT
      if (params[1] == 'LSHIFT') {
        return () =>
          ready(params[0]) && ready(params[2])
            ? store(output, read(params[0]) << read(params[2]))
            : null;
      }
      // RSHIFT
      if (params[1] == 'RSHIFT') {
        return () =>
          ready(params[0]) && ready(params[2])
            ? store(output, read(params[0]) >> read(params[2]))
            : null;
      }

      return () => {
        throw new Error(`Unhandled ${line}`);
      };
    });

    // Keep running operations until all of them have been resolved, operations that are not ready for processing return null
    const pendingOperations = [...operations];
    while (pendingOperations.length > 0) {
      const operation = pendingOperations.shift()!;
      if (operation() == null) {
        pendingOperations.push(operation);
      }
    }
    return memory;
  };

  let memory = execute(input);
  const result = memory[opts.isTest ? 'h' : 'a'];
  if (part == 1) {
    return result;
  }

  // Reset, rewire instruction that resulted in A to B
  memory = execute([
    ...input.filter((instruction) => instruction.endsWith(` -> b`) == false),
    `${result} -> b`
  ]);
  return memory[opts.isTest ? 'h' : 'a'];
}).tests(
  `123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i`.split('\n'),
  65412,
  65412
);
