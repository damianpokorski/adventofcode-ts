import { Argument, Option, program } from 'commander';
import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { terminal } from 'terminal-kit';
import './solvers';
import { Days, executeTest, getRegistryItems, Part, Years } from './utils';
export * from './utils/registry';

export const command = (command: string[]) => {
  return program
    .name('adventofcode')
    .command('solve')
    .description('Begins solving specific advent of code issue')
    .addArgument(new Argument('<year>', 'Year to pick puzzles from').choices(['2023', '2024']).argOptional())
    .addArgument(
      new Argument('<day>', 'Day to solve puzle off')
        .choices([...new Array(25)].map((_, i) => (i + 1).toString()))
        .argOptional()
    )
    .addArgument(new Argument('<part>', 'Day to solve puzle off').choices(['1', '2', '.']).argOptional())
    .addOption(
      new Option('--tests-required', 'Requires tests to run before executing against real data').default(true)
    )
    .addOption(new Option('--no-tests-required', 'Does not require tests to be passing before running'))
    .action(
      async (selectedYear: Years, selectedDay: Days, part: Part, options: { testsRequired: boolean }) => {
        // Flatter registry
        const puzzles = getRegistryItems((year, day) => {
          return (
            (selectedYear == undefined || selectedYear == year) &&
            (selectedDay == undefined || selectedDay == day)
          );
        });
        const parts = (part == undefined ? [1, 2] : [part]) as Part[];

        // If no solvers found in registry, create a new solver from template
        if (puzzles.length == 0 && selectedYear !== '.' && selectedDay !== '.') {
          console.log(
            `Failed to find solution for ${selectedYear}/${selectedDay} Part: ${parts.join(',')}... `
          );
          const solutionFile = `./source/solvers/${selectedYear}${selectedDay.toString().padStart(2, '0')}.ts`;
          if (!existsSync(solutionFile)) {
            cpSync(`./source/solvers/TEMPLATE`, solutionFile);
            console.log(`Created a new placeholder entry for missing puzzle`);
          }
        }

        // Iterate through all solutions
        const table = [['Year', 'Day', 'Part', 'Test', 'Duration', 'Result']];
        for (const [year, day, solution] of puzzles) {
          const path = `./.input/${year}${day.toString().padStart(2, '0')}.txt`;

          if (!existsSync(path)) {
            console.error(`No puzzle file found in: ${path} creating empty`);
            writeFileSync(path, '', { encoding: 'utf-8' });
            continue;
          }
          const data = readFileSync(path, { encoding: 'utf-8' }).split('\n');

          for (const currentPart of parts) {
            // Run the test
            const startTest = performance.now();
            const testResult = await executeTest(year, day, currentPart);
            const testDuration = (performance.now() - startTest).toFixed(2);

            const skipped = !(
              options.testsRequired == false ||
              (options.testsRequired && testResult == true)
            );

            // Run the solver
            const start = performance.now();
            const result = await (!skipped ? solution(currentPart, data) : Promise.resolve('Skipped'));
            const duration = (performance.now() - start).toFixed(2);

            // Tabulate
            table.push([
              `${year}`,
              `${day}`,
              `${currentPart}`,
              testResult == true ? `✅ ${testDuration}ms` : testResult == false ? '❌' : '',
              !skipped ? `${duration}ms` : '',
              result
            ]);
          }
        }

        terminal.table(
          table.map((row, index) => {
            // Empty repeated cells
            return row
              .map((cell, cellIndex) =>
                index == 0 || cellIndex > 2 ? cell : table[index - 1][cellIndex] == cell ? '' : cell
              )
              .map((cell) => ` ${cell} `);
          }),
          { fit: false, hasBorder: true, borderChars: 'lightRounded' }
        );
      }
    )
    .parseAsync(command);
};

// Auto call the command if not in unit test context
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    await command(process.argv);
  })();
}
