import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import packageJson from './package.json' with { type: 'json' };
import json from '@rollup/plugin-json';
import path from 'upath';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { author, dependencies, devDependencies, name, version } = packageJson;

// Packages that should be bundled
const bundledPackages = ['p-limit', 'deepmerge-ts', 'hexo-is', 'is-stream', 'markdown-it', 'node-cache'];

// List external dependencies, excluding specific packages that should be bundled
const external = [...Object.keys(dependencies), ...Object.keys(devDependencies)].filter(
  (pkgName) => !bundledPackages.includes(pkgName)
);

const banner = `// ${name} ${version} by ${author.name} <${author.email}> (${author.url})`.trim();
const esmBanner = `${banner}\n\nimport nodeUrl from 'node:url';\nimport nodePath from 'path';\nconst __filename = nodeUrl.fileURLToPath(import.meta.url);\nconst __dirname = nodePath.dirname(__filename);`;
const plugins = [
  json(),
  resolve({ preferBuiltins: true }),
  commonjs({ exclude: ['**/*.cjs', '**/*.d.cts'] }),
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
];

/**
 * @type {import('rollup').RollupOptions}
 */
const _libs = {
  input: './tmp/dist/src/index.js',
  output: [
    {
      dir: 'dist',
      format: 'esm',
      banner,
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: entryFileNamesWithExt('js'),
      chunkFileNames: chunkFileNamesWithExt('js')
    },
    {
      dir: 'dist',
      format: 'cjs',
      banner,
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: entryFileNamesWithExt('cjs'),
      chunkFileNames: chunkFileNamesWithExt('cjs')
    },
    {
      dir: 'dist',
      format: 'esm',
      banner: esmBanner,
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: entryFileNamesWithExt('mjs'),
      chunkFileNames: chunkFileNamesWithExt('mjs')
    }
  ],
  external,
  plugins
};

const _exports = {
  input: './tmp/dist/src/exports.js',
  output: [
    {
      dir: 'dist',
      format: 'esm',
      banner,
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: entryFileNamesWithExt('js'),
      chunkFileNames: chunkFileNamesWithExt('js')
    },
    {
      dir: 'dist',
      format: 'cjs',
      banner,
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: entryFileNamesWithExt('cjs'),
      chunkFileNames: chunkFileNamesWithExt('cjs')
    },
    {
      dir: 'dist',
      format: 'esm',
      banner: esmBanner,
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: entryFileNamesWithExt('mjs'),
      chunkFileNames: chunkFileNamesWithExt('mjs')
    }
  ],
  external,
  plugins
};

/**
 * @type {import('rollup').RollupOptions}
 */
const _declaration = {
  input: './tmp/dist/src/exports.d.ts',
  output: [
    {
      dir: 'dist',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: '[name].d.ts'
    },
    {
      dir: 'dist',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: '[name].d.mts'
    },
    {
      dir: 'dist',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: '[name].d.cts'
    }
  ],
  plugins: [resolve({ preferBuiltins: true }), dts()],
  external
};

export default [_libs, _exports];

fs.ensureDirSync('tmp');
fs.writeFileSync('tmp/rollup.log', `Rollup build started at ${new Date().toISOString()}\n\n`);

/**
 * Returns a function to generate entry file names with the given extension for Rollup output.
 * For node_modules, places in dependencies folder and logs the mapping.
 * @param {string} ext - The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { facadeModuleId: string }) => string}
 */
export function entryFileNamesWithExt(ext) {
  // Ensure the extension does not start with a dot
  if (ext.startsWith('.')) {
    ext = ext.slice(1);
  }
  return function ({ facadeModuleId }) {
    facadeModuleId = path.toUnix(facadeModuleId);
    if (!facadeModuleId.includes('node_modules')) {
      return `[name].${ext}`;
    }
    // Find the first occurrence of 'node_modules' and slice from there
    const nodeModulesIdx = facadeModuleId.indexOf('node_modules');
    let rel = facadeModuleId.slice(nodeModulesIdx);
    rel = rel.replace('node_modules', 'dependencies');
    // Remove extension using upath.extname
    rel = rel.slice(0, -path.extname(rel).length) + `.${ext}`;
    // Remove any null bytes (\x00) that may be present (Rollup sometimes injects these)
    rel = rel.replace(/\0/g, '');
    // Remove any leading slashes
    rel = rel.replace(/^\/\/+/, '');

    fs.appendFileSync(
      'tmp/rollup.log',
      `entryFileNamesWithExt:\n  [facadeModuleId] ${facadeModuleId}\n  [rel] ${rel}\n`
    );
    return rel;
  };
}

/**
 * Returns a function to generate chunk file names with the given extension for Rollup output.
 * For node_modules chunks, places in dependencies folder and removes extension.
 * @param {string} ext - The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { name: string }) => string}
 */
export function chunkFileNamesWithExt(ext) {
  return function ({ name }) {
    // For node_modules chunks, place in dependencies folder
    if (name && name.includes('node_modules')) {
      const nodeModulesIdx = name.indexOf('node_modules');
      let rel = name.slice(nodeModulesIdx);
      rel = rel.replace('node_modules', 'dependencies');
      // Remove extension using upath.extname
      rel = rel.slice(0, -path.extname(rel).length);
      // Remove any null bytes (\x00) that may be present
      rel = rel.replace(/\0/g, '');
      // Remove any leading slashes
      rel = rel.replace(/^\/\/+/, '');
      return `${rel}-[hash].${ext}`;
    }
    // For local chunks, keep the default pattern
    return `[name]-[hash].${ext}`;
  };
}
