import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const operations = input[input.length - 1]?.trim()?.split(/\s+/)!;

  // Split columns while preserving whitespaces - using operators as anchor points
  const columnRanges = input[input.length - 1]
    .split('')
    .map((value, index) => [value, index] as [string, number])
    .filter(([value, _]) => value !== ' ')
    .map(
      ([_, position], index, other) =>
        [position, other[index + 1]?.[1]] as [number, number]
    );

  // Slice the worksheets using operator ranges
  const values = input
    .slice(0, input.length - 1)
    .map((line) =>
      columnRanges.map(([start, end]) =>
        line.slice(start, end == undefined ? undefined : end - 1)
      )
    );

  // Transpose columns and rows
  let columns = values.transpose();

  // Transpose strings within columns as they are - including whitespace
  if (part == 2) {
    columns = columns.map((column) => {
      const maxLength = Math.max(...column.map((v) => v.length));
      return column
        .map((v) => v.padEnd(maxLength, ' ').split(''))
        .transpose()
        .map((v) => v.join('').trim());
    });
  }

  // Trim all fields, convert to numbers, perform relevant op
  return columns
    .map((column, index) =>
      column
        .map((x) => x.trim())
        .asNumbers()
        .reduce((a, b) => {
          return operations[index] == '*' ? a * b : a + b;
        })
    )
    .sum();
}).tests(
  `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `.split('\n'),
  4277556,
  3263827
);
