const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const resolve = require('@rollup/plugin-node-resolve').default;
const { dts } = require('rollup-plugin-dts');
const packageJson = require('./package.json');
const json = require('@rollup/plugin-json').default;

const { author, dependencies, devDependencies, name, version } = packageJson;

// Packages that should be bundled
const bundledPackages = ['p-limit', 'deepmerge-ts', 'hexo-is', 'is-stream', 'markdown-it', 'node-cache'];

// List external dependencies, excluding specific packages that should be bundled
const external = [...Object.keys(dependencies), ...Object.keys(devDependencies)].filter(
  (pkgName) => !bundledPackages.includes(pkgName)
);

const banner = `// ${name} ${version} by ${author.name} <${author.email}> (${author.url})`.trim();
const esmBanner = `
${banner}

import nodeUrl from 'node:url';
import nodePath from 'path';
const __filename = nodeUrl.fileURLToPath(import.meta.url);
const __dirname = nodePath.dirname(__filename);
`.trim();

/**
 * @type {import('rollup').RollupOptions}
 */
const libs = {
  input: './tmp/dist/src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      banner
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
      banner
    },
    {
      file: 'dist/index.mjs',
      format: 'esm',
      exports: 'named',
      banner: esmBanner
    }
  ],
  external,
  plugins: [
    json(),
    resolve({ preferBuiltins: true }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env', { targets: { node: '18' } }]]
    }),
    {
      name: 'replace-process-env',
      transform(code) {
        return {
          code: code.replace(/process\.env\.NODE_ENV/g, JSON.stringify('production')),
          map: { mappings: '' }
        };
      }
    }
  ]
};

/**
 * @type {import('rollup').RollupOptions}
 */
const declaration = {
  input: './tmp/dist/src/hexo-seo.d.ts',
  output: [
    { file: 'dist/index.d.ts', format: 'es', exports: 'named' },
    { file: 'dist/index.d.mts', format: 'es', exports: 'named' },
    { file: 'dist/index.d.cts', format: 'es', exports: 'named' }
  ],
  plugins: [resolve({ preferBuiltins: true }), dts()],
  external
};

module.exports = [libs, declaration];
