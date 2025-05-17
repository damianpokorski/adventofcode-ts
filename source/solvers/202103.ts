import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const data = input.map((line) =>
    line.split('').map((value) => parseInt(value))
  );

  // Calculate most common bit for each column
  const getGamma = (rowsOfBinaryValues: number[][]) =>
    rowsOfBinaryValues
      .reduce(
        (sum, rowOfBinaryValues) =>
          sum.map(
            (binaryValueSum, binaryValueHorizontalIndex) =>
              binaryValueSum + rowOfBinaryValues[binaryValueHorizontalIndex]
          ),
        data[0].map((x) => 0)
      )
      .map((sumOfBinaryValues) =>
        sumOfBinaryValues >= rowsOfBinaryValues.length / 2 ? 1 : 0
      );

  const getEpsilon = (rowsOfBinaryValues: number[][]) =>
    getGamma(rowsOfBinaryValues).map((binaryValue) =>
      binaryValue == 1 ? 0 : 1
    );

  const binaryArrayToDecimal = (rowsOfBinaryValues: number[]) =>
    parseInt(
      rowsOfBinaryValues.map((binaryValue) => binaryValue.toString()).join(''),
      2
    );

  // Part 1: Solution
  if (part == 1) {
    return (
      binaryArrayToDecimal(getGamma(data)) *
      binaryArrayToDecimal(getEpsilon(data))
    );
  }

  // Part 2
  // Starting with most popular binary value
  const getRating = (
    rowsOfBinaryValues: number[][],
    evaluator: (rowsOfBinaryValues: number[][]) => (0 | 1)[]
  ) => {
    const criteria = [evaluator(rowsOfBinaryValues)[0]];

    // Follow gamma matching in order to get oxygen Generate rating
    let dataMatchingCriteria = [...rowsOfBinaryValues];

    while (dataMatchingCriteria.length !== 1) {
      dataMatchingCriteria = dataMatchingCriteria.filter((binaryValues) =>
        criteria.every(
          (criteriaValue, criteriaIndex) =>
            binaryValues[criteriaIndex] == criteriaValue
        )
      );

      // Calculate next gamma character
      criteria.push(evaluator(dataMatchingCriteria)[criteria.length]);
    }
    return binaryArrayToDecimal(dataMatchingCriteria[0]);
  };

  return getRating(data, getGamma) * getRating(data, getEpsilon);
}).tests(
  `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`.split('\n'),
  198,
  230
);
