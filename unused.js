/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const depcheck = require("depcheck");
const { writeFileSync } = require("fs");
const { join } = require("path");

const options = {
  ignoreBinPackage: false, // ignore the packages with bin entry
  skipMissing: false, // skip calculation of missing dependencies
  ignorePatterns: [
    // files matching these patterns will be ignored
    "sandbox",
    "dist",
    "bower_components",
    "node_modules",
    "docs",
    "exclude"
  ],
  ignoreMatches: [
    // ignore dependencies that matches these globs
    "grunt-*",
    "hexo-*",
    "@typescript-eslint*"
  ],
  parsers: {
    // the target parsers
    "**/*.ts": depcheck.parser.typescript,
    "**/*.js": depcheck.parser.es6,
    "**/*.jsx": depcheck.parser.jsx
  },
  detectors: [
    // the target detectors
    depcheck.detector.requireCallExpression,
    depcheck.detector.importDeclaration
  ],
  specials: [
    // the target special parsers
    depcheck.special.eslint,
    depcheck.special.webpack
  ],
  package: {
    // may specify dependencies instead of parsing package.json
    dependencies: {
      lodash: "^4.17.15"
    },
    devDependencies: {
      eslint: "^6.6.0"
    },
    peerDependencies: {},
    optionalDependencies: {}
  }
};

depcheck(__dirname, options).then((unused) => {
  writeFileSync(join(__dirname, "unused.md"), "```json\n" + JSON.stringify(unused, null, 2) + "\n```");
});
