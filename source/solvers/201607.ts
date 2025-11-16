import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  // Parse input, and group by square brackets
  const ips = input
    .map((line) => line.replaceAll('[', ']').split(']'))
    .map((segments) => ({
      outer: segments.filter((_, index) => index % 2 == 0),
      inner: segments.filter((_, index) => index % 2 == 1)
    }));

  // Part 1 - Detect ABBA outside of square brackets, and confirm no abba inside
  const containsABBA = (text: string) =>
    [...text.windows(4)].some(
      (slice) =>
        slice[0] == slice[3] && slice[1] == slice[2] && slice[0] !== slice[1]
    );

  if (part == 1) {
    return ips.filter(({ inner, outer }) => {
      return (
        inner.some((segment) => containsABBA(segment)) == false &&
        outer.some((segment) => containsABBA(segment))
      );
    }).length;
  }

  // Part 2 - Find sections with ABAs that have matching BABs in []
  const getABAs = (text: string) =>
    [...text.windows(3)].filter(
      (slice) => slice[0] == slice[2] && slice[0] !== slice[1]
    );

  return ips.filter(({ inner, outer }) => {
    const innerABAs = inner.flatMap(getABAs).filter((x) => x !== undefined);
    const outerABAs = outer.flatMap(getABAs).filter((x) => x !== undefined);

    // console.log({ innerABAs, outerABAs });
    return innerABAs.some((a) =>
      outerABAs.some((b) => a[0] == b[1] && b[0] == a[1])
    );
  }).length;
}).tests(
  `abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn`.split('\n'),
  2,
  0
);
