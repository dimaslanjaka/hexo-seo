import { ESLint } from 'eslint';
import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { normalizePathUnix } from 'sbg-utility';
import { fileURLToPath } from 'url';

// index.ts exports builder
// this only for development and excluded from build config

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create export
glob('**/*.{ts,js,jsx,tsx,cjs,mjs}', {
  ignore: [
    '**/*.builder.*',
    '**/*.test.*',
    '**/*.spec*.*',
    '**/*.runner.*',
    '**/_*test',
    '**/_*spec',
    '**/_*runner',
    '**/index-exports.*',
    '**/index.*',
    'exports.ts',
    '**/__*'
  ],
  cwd: __dirname,
  absolute: true
}).then(async (files) => {
  const map = files
    .map((f) => normalizePathUnix(f))
    .filter((file) => {
      const isFile = fs.statSync(file).isFile();
      const currentIndex = normalizePathUnix(__dirname, 'index.ts');
      const currentIndexExports = normalizePathUnix(__dirname, 'index-exports.ts');
      return isFile && file !== currentIndex && file !== currentIndexExports;
    })
    .map((file) => normalizePathUnix(file).replace(normalizePathUnix(__dirname), ''))
    .map((file) => {
      const fileId =
        '_' +
        normalizePathUnix(file)
          .replace(normalizePathUnix(__dirname), '')
          .replace(/.(ts|js|tsx|jsx|cjs)$/, '');
      const importName = fileId
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-alphanumeric characters
        .split(' ') // Split by spaces
        .filter(Boolean) // Remove empty strings
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join the words back into a string
      return {
        file,
        name: importName,
        import: `import * as ${importName} from '.${file.replace(/.(ts|js|tsx|jsx|cjs)$/, '')}';`,
        export: `export * from '.${file.replace(/.(ts|js|tsx|jsx|cjs)$/, '')}';`
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(path.join(__dirname, 'index-exports.ts'), map.map((o) => o.export).join('\n'));

  fs.writeFileSync(
    path.join(__dirname, 'exports.ts'),
    [`export * from './index-exports'`, `import * as lib from './index-exports'`, 'export default lib'].join('\n')
  );

  const lint = new ESLint({ fix: true });
  // Lint the specified TypeScript file.
  const results = await lint.lintFiles(['src/**/*.ts']);

  // Apply the fixes to the file.
  await ESLint.outputFixes(results);

  // Format and display the results.
  const formatter = await lint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  console.log(resultText);
});
