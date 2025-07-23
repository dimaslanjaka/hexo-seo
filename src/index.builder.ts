import { ESLint } from 'eslint';
import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { normalizePathUnix } from 'sbg-utility';
import { fileURLToPath, pathToFileURL } from 'url';

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
  const map = [];
  for (const f of files.map((f) => normalizePathUnix(f))) {
    const isFile = fs.statSync(f).isFile();
    const currentIndex = normalizePathUnix(__dirname, 'index.ts');
    const currentIndexExports = normalizePathUnix(__dirname, 'index-exports.ts');
    if (!(isFile && f !== currentIndex && f !== currentIndexExports)) continue;
    const file = normalizePathUnix(f).replace(normalizePathUnix(__dirname), '');
    const fileId =
      '_' +
      normalizePathUnix(file)
        .replace(normalizePathUnix(__dirname), '')
        .replace(/.(ts|js|tsx|jsx|cjs)$/, '');
    const importName = fileId
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    let fileImportPath = file.replace(/.(ts|js|tsx|jsx|cjs)$/, '');
    if (/.(cjs|mjs)$/.test(file)) {
      fileImportPath = file;
      if (/.cjs$/.test(fileImportPath)) {
        // Use dynamic import for CJS and enumerate its exports from default
        const fileUrl = pathToFileURL(path.join(__dirname, fileImportPath)).href;
        const mod = await import(fileUrl);
        const keys = mod && mod.default ? Object.keys(mod.default) : [];
        console.log(`CJS file: ${fileImportPath}, exports:`, keys);
        if (keys.length > 0) {
          const namedExports = `export { ${keys.join(', ')} } from '.${fileImportPath}';`;
          const cjsObject = {
            file,
            name: importName,
            import: `import * as ${importName} from '.${fileImportPath}';`,
            export: namedExports
          };
          console.log(`CJS export for ${fileImportPath}:`, cjsObject);
          map.push(cjsObject);
          continue;
        }
        // fallback: namespace export
        map.push({
          file,
          name: importName,
          import: `import * as ${importName} from '.${fileImportPath}';`,
          export: `import * as ${importName} from '.${fileImportPath}';\nexport { ${importName} };`
        });
        continue;
      }
    }
    map.push({
      file,
      name: importName,
      import: `import * as ${importName} from '.${fileImportPath}';`,
      export: `export * from '.${fileImportPath}';`
    });
  }
  map.sort((a, b) => a.name.localeCompare(b.name));

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
