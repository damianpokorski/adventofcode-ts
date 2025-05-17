import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const equations = input
    .map((value) => value.split(': '))
    .map(([sum, values]) => [
      parseInt(sum),
      values.split(' ').map((value) => parseInt(value))
    ]) as [number, number[]][];

  const operators = part == 1 ? [`+`, `*`] : [`+`, `*`, `||`];

  const useOperator = (a: number, b: number, op: string) => {
    if (op == '+') {
      return a + b;
    }
    if (op == '*') {
      return a * b;
    }
    return parseInt(`${a}${b}`);
  };

  const recursive = (first: number, other: number[], targetSum: number) => {
    if (other.length == 0) {
      return first == targetSum;
    }
    // Operators are always increasing the value, once we're past it, we know it's a failure
    if (first > targetSum) {
      return false;
    }

    for (const op of operators) {
      if (
        recursive(useOperator(first, other[0], op), other.slice(1), targetSum)
      ) {
        return true;
      }
    }
    return false;
  };

  let total = 0;
  for (const [sum, values] of equations) {
    if (recursive(values[0], values.slice(1), sum)) {
      total += sum;
    }
  }

  return total;
})
  .test(
    1,
    `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`.split('\n'),
    3749
  )
  .test(
    2,
    `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`.split('\n'),
    11387
  );
