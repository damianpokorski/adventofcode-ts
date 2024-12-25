/* eslint-disable @typescript-eslint/prefer-for-of */
import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const keysAndLocks = input
    .join('\n')
    .split('\n\n')
    .map((section) => section.split('\n'));

  const digitize = (schema: string[]) => {
    const sums = new Array(schema[0].length).fill(-1);
    for (let y = 0; y < schema.length; y++) {
      for (let x = 0; x < schema[y].length; x++) {
        sums[x] += schema[y][x] == '#' ? 1 : 0;
      }
    }
    return sums;
  };

  const locks = keysAndLocks.filter((rows) => rows[0].split('').every((char) => char == '#')).map(digitize);
  const keys = keysAndLocks
    .filter((rows) => rows[rows.length - 1].split('').every((char) => char == '#'))
    .map(digitize);

  console.log(locks, keys);

  return locks
    .map((lock) => {
      return keys
        .map((key) => {
          const fit = lock.zip(key).map(([lockHeight, keyHeight]) => lockHeight + keyHeight);
          console.log(`Lock ${lock.join(',')} and key ${key.join(',')}: ${fit.join(',')}`);
          // return fit.every((column) => column == fit[0]) ? 1 : 0;
          return fit.every((column) => column < 6);
        })
        .sum();
    })
    .sum();
}).tests(
  `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`.split('\n'),
  3
);
