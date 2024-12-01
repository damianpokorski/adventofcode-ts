
import {Argument, Option, program} from "commander";
import './2024';
import { Days, execute, Part, Years } from "./registry";
import {existsSync, readFileSync} from 'fs'
export * from './registry';

export const command = (command: string[], data?: string[]) => {
    const result = program.command(
        'adventofcode'
    ).description('Begins solving specific advent of code issue')
    .addArgument(new Argument('<year>', 'Year to pick puzzles from').choices(['2024']).default('2024'))
    .addArgument(new Argument('<day>', 'Day to solve puzle off').choices([...new Array(25)].map((_, i) => (i+1).toString())).default('1'))
    .addArgument(new Argument('<part>', 'Day to solve puzle off').choices(['1', '2']).default('1'))
    .action(async (year: Years, day: Days, part: Part, opts) => {

        console.log(`Loading contents`)
        const path = `./.input/${year}-${day}.txt`;
        if(!existsSync(path)) {
            throw new Error(`No puzzle file found in: ${path}`);
        }
        const data = readFileSync(path, {'encoding': 'utf-8'}).split("\n");

        const result = await execute(year, day, part, data);
        console.log(`Result for ${year}/${day} Part ${part} is: ${result}`);
    })
    .parseAsync(command);
}

// Auto call the command if not in unit test context
if(process.env.NODE_ENV !== 'test') {
    (async () => {
        await command(process.argv);
    })();
}