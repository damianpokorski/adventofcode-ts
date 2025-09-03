import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const seats = input
    .map((line) => {
      const binary = line
        .split('')
        .map((r) => (r == 'B' || r == 'R' ? 1 : 0))
        .join('');

      const row = parseInt(binary.substring(0, 7), 2);
      const seat = parseInt(binary.substring(7, 10), 2);
      const id = row * 8 + seat;
      return id;
    })
    .sort((a, b) => a - b);
  // Find the highest seat id
  if (part == 1) {
    return Math.max(...seats);
  }

  // Find a seat next to a gap, subtract one from it
  return (
    seats.find((id, index) => index > 0 && seats[index - 1] == id - 2)! - 1
  );
}).tests(`FFFBBFFRRL\nFFFBBFBLLL`.split('\n'), 104, 103);
