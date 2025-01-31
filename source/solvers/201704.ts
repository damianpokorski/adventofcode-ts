import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return (
    input
      .map((line) => line.split(' '))
      // Part 1 - Compare words as they are, Part 2 - sort all words by letters to also exclude anagrams
      .map((words) => (part == 1 ? words : words.map((word) => word.split('').sort().join(''))))
      .filter((words) => words.length == words.distinct().length).length
  );
}).tests(
  `aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa`.split('\n'),
  2,
  2
);
