import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const characters = input.join('').split('');
  const packetSize = part == 1 ? 4 : 14;
  // Scan window of 4/14 characters, return position of first completely unique set
  for (let i = 0; i + packetSize < characters.length; i++) {
    const set = characters.slice(i, i + packetSize);
    if (set.length == set.distinct().length) {
      return i + packetSize;
    }
  }

  return;
}).tests(`bvwbjplbgvbhsrlpgdmjqwftvncz`.split('\n'), 5, 23);
