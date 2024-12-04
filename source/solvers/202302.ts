import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return input
    .map((row) => {
      // Parse input
      const [game, setsRaw] = row.split(':');
      const gameId = parseInt(game.replace('Game ', ''), 10);

      const sets = setsRaw.split(';').map((x) =>
        x
          .split(', ')
          .map((y) => y.trim().split(' '))
          .map(([number, color]) => ({ [color]: parseInt(number, 10) }))
          .reduce((dictionary, pair) => ({ ...dictionary, ...pair }), {})
      );

      // Extract max counts per game
      const maxSets = sets.reduce((maxValues, currentValues) => {
        for (const [color, count] of Object.entries(currentValues)) {
          maxValues[color] = Math.max(count, maxValues[color] ?? 0);
        }
        return maxValues;
      }, {});

      // Part 1
      if (part == 1) {
        for (const [requiredColor, requiredCount] of Object.entries(maxSets)) {
          const colours = {
            red: 12,
            green: 13,
            blue: 14
          } as Record<string, number>;
          const availableColor = colours[requiredColor] ?? 0;
          if (availableColor < requiredCount) {
            return 0;
          }
        }
        return gameId;
      }

      // Part 2
      return Object.values(maxSets).reduce((a, b) => a * b, 1);
    })
    .reduce((a, b) => a + b, 0)
    .toString();
})
  .test(
    1,
    `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split('\n'),
    8
  )
  .test(
    2,
    `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split('\n'),
    2286
  );
