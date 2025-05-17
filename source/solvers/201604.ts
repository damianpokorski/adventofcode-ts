import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const data = input
    .map((line) => line.split('['))
    .map(([left, right]) => [
      left.split('-'),
      right.slice(0, right.length - 1).split('')
    ])
    .map(
      ([left, right]) =>
        [
          left.slice(0, left.length - 1),
          parseInt(left[left.length - 1]),
          right
        ] as [string[], number, string[]]
    );

  if (part == 2) {
    return data
      .filter(([words, id]) =>
        ['northpole object storage', 'very encrypted name'].includes(
          words
            .map((word) =>
              word
                .split('')
                .map(
                  (letter) =>
                    alphabet[(alphabet.indexOf(letter) + id) % alphabet.length]
                )
                .join('')
            )
            .join(' ')
        )
      )
      .map(([_, id]) => id)
      .shift();
  }

  return data
    .filter(([words, id, checksum]) => {
      return (
        Object.entries(
          Object.entries(
            words
              .join('')
              .split('')
              .groupBy((v) => v)
          )
        )
          .map(
            ([_, entries]) =>
              [
                entries[1].length,
                entries.flat()[0],
                alphabet.indexOf(entries.flat()[0])
              ] as [number, string, number]
          )
          .sort(([countA, a, priorityA], [countB, b, priorityB]) =>
            countA == countB ? priorityA - priorityB : countB - countA
          )
          .map(([_, letter]) => letter)
          .slice(0, 5)
          .join() == checksum.join()
      );
    })
    .map(([_, id]) => id)
    .sum();
}).tests(
  `aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]
qzmt-zixmtkozy-ivhz-343[fasd]`.split('\n'),
  1514,
  343
);
