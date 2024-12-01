import { Argument, program } from 'commander';
import { existsSync, readFileSync } from 'fs';
import './2024';
import { Days, getRegistryItems, Part, Years } from './registry';
export * from './registry';

export const command = (command: string[]) => {
  return program
    .command('adventofcode')
    .description('Begins solving specific advent of code issue')
    .addArgument(
      new Argument('<year>', 'Year to pick puzzles from')
        .choices(['2024'])
        .argOptional()
    )
    .addArgument(
      new Argument('<day>', 'Day to solve puzle off')
        .choices([...new Array(25)].map((_, i) => (i + 1).toString()))
        .argOptional()
    )
    .addArgument(
      new Argument('<part>', 'Day to solve puzle off')
        .choices(['1', '2', '.'])
        .argOptional()
    )
    .action(async (selectedYear: Years, selectedDay: Days, part: Part) => {
      // Flatter registry
      const puzzles = getRegistryItems((year, day) => {
        return (
          (selectedYear == undefined || selectedYear == year) &&
          (selectedDay == undefined || selectedDay == day)
        );
      });
      const parts = (part == undefined ? [1, 2] : [part]) as Part[];

      // If no solvers found in registry, log it
      if (puzzles.length == 0) {
        console.log(
          `Failed to find solution for ${selectedYear}/${selectedDay} Part: ${parts.join(',')}`
        );
      }

      // Iterate through all solutions
      for (const [year, day, solution] of puzzles) {
        const path = `./.input/${year}/${day}.txt`;

        if (!existsSync(path)) {
          console.error(`No puzzle file found in: ${path}`);
        }
        const data = readFileSync(path, { encoding: 'utf-8' }).split('\n');

        for (const currentPart of parts) {
          const result = await solution(currentPart, data);
          console.log(
            `Result for ${year}/${day} Part ${currentPart} is: ${result}`
          );
        }
      }
    })
    .parseAsync(command);
};

// Auto call the command if not in unit test context
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    await command(process.argv);
  })();
}