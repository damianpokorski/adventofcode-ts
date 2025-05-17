import "../utils";
import { initialize } from "../utils/registry";
const vowels = ["a", "e", "i", "o", "u"];

initialize(__filename, async (part, input) => {
  if (part === 1) {
    return input
      .map((line) => ({
        line: line,
        vowels: line.split("").filter((letter) => vowels.includes(letter)),
        pairDiffs: line
          .split("")
          .pairwise()
          .map(([a, b]) => a.charCodeAt(0) - b.charCodeAt(0)),
      }))
      .map((entry) => ({
        ...entry,
        repeatLetters: entry.pairDiffs.some((diff) => diff === 0),
        disallowed: ["ab", "cd", "pq", "xy"].some((blacklisted) =>
          entry.line.includes(blacklisted),
        ),
      }))
      .filter(
        (entry) =>
          entry.vowels.length >= 3 &&
          entry.repeatLetters &&
          entry.disallowed === false,
      ).length;
  }

  return input
    .map((line) => [line, line.split("")] as const)
    .filter(
      ([line, letters]) =>
        // check if we have a recurring letter with a gap:
        letters.some(
          (letter, index, otherLetters) => otherLetters[index + 2] === letter,
        ) &&
        // check for duplicate pairs
        letters
          .pairwise()
          .some(([a, b], index) => line.lastIndexOf(`${a}${b}`) > index + 1),
    ).length;
})
  .test(
    1,
    [
      "ugknbfddgicrmopn",
      "aaa",
      "jchzalrnumimnmhp",
      "haegwjzuvuyypxyu",
      "dvszwmarrgswjxmb",
    ],
    2,
  )
  .test(
    2,
    ["qjhvhtzxzqqjkmpb", "xxyxx", "uurcxstgmygtbstg", "ieodomkazucvgmuy"],
    2,
  );
