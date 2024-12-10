import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const sectors = input
    .join('')
    .split('')
    .map((x, index) => ({
      size: parseInt(x),
      isFile: index % 2 == 0,
      id: index % 2 == 0 ? Math.floor(index / 2) : Math.floor(index / 2) + 1,
      index: index,
      shifted: false
    }));

  if (part == 1) {
    const files = sectors.filter((x) => x.isFile).map((x) => [x.id, x.size]);
    const blanks = sectors.filter((x) => x.isFile == false).map((x) => x.size);
    const blankBuffer = [] as number[];
    let bufferIndex = 0;
    let checksum = 0;

    while (files.length > 0) {
      const [index, size] = files.shift() ?? [0, 0];
      // Fill in the next file block from the list
      for (let i = 0; i < size; i++) {
        checksum += bufferIndex * index;
        bufferIndex++;
      }
      // Now we've finished a file, we should fill in new empty buffer
      const blankSize = blanks.shift() ?? 0;
      if (part == 1) {
        for (let i = 0; i < blankSize; i++) {
          // Top up blank buffer whenever we're out
          if (blankBuffer.length == 0) {
            // Grab next digit if our buffer is empty
            const [fillIndex, fillSize] = files.pop() ?? [0, 0];
            blankBuffer.push(...[...new Array(fillSize)].map((_) => fillIndex));
          }
          const endIndex = blankBuffer.shift() ?? 0;
          checksum += bufferIndex * endIndex;
          bufferIndex++;
        }
      }
    }

    // Add outstanding checksum bits back as files
    if (files.length == 0) {
      while (blankBuffer.length > 0) {
        const file = blankBuffer.shift() ?? 0;
        checksum += bufferIndex * file;
        bufferIndex++;
      }
    }
    return checksum;
  }

  while (true) {
    const lastFileIndex = sectors.findLastIndex((file) => file.isFile && file.shifted == false);

    // If we moved all of the files - we're done
    if (lastFileIndex == -1) {
      break;
    }

    // Grab file data
    const file = sectors[lastFileIndex];

    // Mark that we've attempted to shift this
    file.shifted = true;

    // Go through blank spaces
    for (let blankIndex = 0; blankIndex < sectors.length; blankIndex++) {
      const blank = sectors[blankIndex];
      if (blank.isFile == false && blank.size >= file.size && blank.index < file.index) {
        // Shift out current file & insert a blank sector in its spot
        sectors.splice(lastFileIndex, 1, {
          ...file,
          isFile: false
        });

        // Decrease the blank size
        blank.size = blank.size - file.size;

        // Splice the shifted out entry just before the blank
        sectors.splice(blankIndex, 0, file);
        break;
      }
    }
  }

  // Go through sectors and calculate the checksum
  let bufferIndex = 0;
  let checksum = 0;

  for (const sector of sectors) {
    for (let i = 0; i < sector.size; i++) {
      if (sector.isFile) {
        checksum += bufferIndex * sector.id;
      }
      bufferIndex++;
    }
  }
  return checksum;
})
  .test(1, `2333133121414131402`.split('\n'), 1928)
  .test(2, `2333133121414131402`.split('\n'), 2858);
