import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return input
    .join('\n')
    .split('\n\n')
    .map((group) => {
      // Part 1 - Number of unique answers within group
      const individualAnswers = group.split('\n').map((list) => list.split(''));
      const positivelyAnsweredQuestions = individualAnswers.flat().distinct();
      if (part == 1) {
        return positivelyAnsweredQuestions.length;
      }

      // Part 2 - Only count questions which everyone answered the same way
      return positivelyAnsweredQuestions.filter((question) =>
        individualAnswers.every((person) => person.includes(question))
      ).length;
    })
    .sum();
}).tests(
  `abc

a
b
c

ab
ac

a
a
a
a

b`.split('\n'),
  11,
  6
);
