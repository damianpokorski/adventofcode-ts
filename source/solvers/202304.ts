import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const scratches = [] as {
    game: string;
    matches: number;
    cards: number;
  }[];

  const totalPoints = input
    .map((row) => {
      const [game, data] = row
        .replace('Card ', '')
        .split(':')
        .map((value) => value.trim());
      const [winningNumbers, elvesNumbers] = data.split(' | ').map((value) =>
        value
          .trim()
          .split(' ')
          .map((numberString) => parseInt(numberString, 10))
          .filter((value) => !isNaN(value))
      );
      const elvesWinningNumbers = elvesNumbers.filter((elvesNumber) => winningNumbers.includes(elvesNumber));
      const elvesPoints = Math.floor(elvesWinningNumbers.reduce((totalPoints) => totalPoints * 2, 1) / 2);

      // Store all of the scratch data - only for part 2
      scratches.push({
        game,
        matches: elvesWinningNumbers.length,
        cards: 1
      });
      return elvesPoints;
    })
    .sum();

  if (part == 1) {
    return totalPoints;
  }

  // Iterate through total cards & adjust card count based on score
  for (let i = 0; i < scratches.length; i++) {
    const scratch = scratches[i];
    for (const followingScratch of scratches.slice(i + 1, i + 1 + scratch.matches)) {
      if (followingScratch) {
        followingScratch.cards = followingScratch.cards + scratch.cards;
      }
    }
  }
  return scratches.map((scratch) => scratch.cards).sum();
})
  .test(
    1,
    `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split('\n'),
    13
  )
  .test(
    2,
    `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split('\n'),
    30
  );
