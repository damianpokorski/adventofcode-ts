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
});
