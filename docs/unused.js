/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const depcheck = require("depcheck");

const options = {
  ignoreBinPackage: false, // ignore the packages with bin entry
  skipMissing: false, // skip calculation of missing dependencies
  ignorePatterns: [
    // files matching these patterns will be ignored
    "sandbox",
    "dist",
    "bower_components"
  ],
  ignoreMatches: [
    // ignore dependencies that matches these globs
    "grunt-*"
  ],
  parsers: {
    // the target parsers
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
  console.log(unused.dependencies); // an array containing the unused dependencies
  console.log(unused.devDependencies); // an array containing the unused devDependencies
  console.log(unused.missing); // a lookup containing the dependencies missing in `package.json` and where they are used
  console.log(unused.using); // a lookup indicating each dependency is used by which files
  console.log(unused.invalidFiles); // files that cannot access or parse
  console.log(unused.invalidDirs); // directories that cannot access
});
