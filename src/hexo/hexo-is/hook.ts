import { copyFileSync, existsSync, readdirSync } from "fs";
import minimatch from "minimatch";
import path from "path";
import tsconfig from "./tsconfig.json";

const outDir = tsconfig.compilerOptions.outDir;
const readDir = readdirSync(__dirname).filter((file) => {
  return matchPatternList(file, tsconfig.include, { matchBase: true });
});

const toProcess = [];
if (existsSync(outDir)) {
  readDir.forEach((file) => {
    const toCopy = path.join(__dirname, file);
    const destCopy = path.resolve(path.join(outDir, file));
    //console.log(toCopy, destCopy);
    copyFileSync(toCopy, destCopy);
  });
}

/**
 * Match a single string against a list of patterns
 *
 * @param path String - a string to match
 * @param patternList Array - list of patterns to match against
 * @param options Object - hash of options that will be passed to minimatch()
 */
function matchPatternList(path, patternList, options) {
  return patternList.some(function (pattern) {
    return minimatch(path, pattern, options);
  });
}
