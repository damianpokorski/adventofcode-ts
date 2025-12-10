import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const [freshRaw, availableRaw] = input
    .join('\n')
    .split('\n\n')
    .map((set) => set.split('\n'));
  const fresh = freshRaw.map(
    (line) => line.split('-').asNumbers() as [number, number]
  );
  const available = availableRaw.asNumbers();

  // Filtering entries to values that are in ranges
  if (part == 1) {
    return available.filter((id) => {
      return fresh.some(([start, end]) => start <= id && end >= id);
    }).length;
  }

  // Keep merging overlapping ranges until no more overlaps
  let modify = true;
  while (modify) {
    modify = false;
    for (let i = 0; i < fresh.length; i++) {
      for (let j = 0; j < fresh.length; j++) {
        // Skip itself
        if (i == j) {
          continue;
        }

        const [startA, endA] = fresh[i];
        const [startB, endB] = fresh[j];
        if (Math.max(startA, startB) <= Math.min(endA, endB)) {
          fresh[i][0] = Math.min(startA, startB, endA, endB);
          fresh[i][1] = Math.max(startA, startB, endA, endB);
          fresh.splice(j, 1);
          modify = true;
          break;
        }
      }
    }
  }
  // Return unique number of entries
  return fresh.map(([a, b]) => 1 + (b - a)).sum();
}).tests(
  `3-5
10-14
16-20
12-18

1
5
8
11
17
32`.split('\n'),
  3,
  14
);
