import { readdirSync, writeFileSync } from 'fs';
/**
 * Cheeky way to just allow copy pasting of solutions & getting them to auto register
 */
writeFileSync(
  './source/solvers/index.ts',
  readdirSync('./source/solvers')
    .map((filename) => filename.replace('.ts', ''))
    .filter((filename) => filename !== 'index.ts')
    .map((filename) => `import './${filename}';`)
    .join('\n') + '\n',
  {
    encoding: 'utf-8'
  }
);

console.log('Updated ./source/solvers/index.ts with new content');