import '../utils';
import { alphabet } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const output: string[] = [];
  for (let i = 0; i < input[0].length; i++) {
    // Grab letters at position
    const lettersAtPosition = input.map((line) => line[i]);

    // Count individual occurrences
    const countedLetters: [string, number][] = alphabet
      .map(
        (letter) =>
          [
            letter,
            lettersAtPosition.reduce(
              (occurrences, letterAtPosition) =>
                occurrences + (letterAtPosition == letter ? 1 : 0),
              0
            )
          ] as [string, number]
      )
      .filter((pair) => pair[1] > 0);

    // Grab relevant letter
    const mostOrLeastFrequentLetter =
      countedLetters.sort((a, b) =>
        part == 1 ? b[1] - a[1] : a[1] - b[1]
      )[0][0] ?? '';
    output.push(mostOrLeastFrequentLetter);
  }

  return output.join('');
}).tests(
  `eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar`.split('\n'),
  `easter`,
  'advent'
);
