"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const minimatch_1 = __importDefault(require("minimatch"));
const path_1 = __importDefault(require("path"));
const locts = path_1.default.join(__dirname, "tsconfig.json");
if ((0, fs_1.existsSync)(locts)) {
    const tsconfig = JSON.parse((0, fs_1.readFileSync)(locts).toString());
    const outDir = tsconfig.compilerOptions.outDir;
    const readDir = (0, fs_1.readdirSync)(__dirname).filter((file) => {
        return matchPatternList(file, tsconfig.include, { matchBase: true });
    });
    if ((0, fs_1.existsSync)(outDir)) {
        readDir.forEach((file) => {
            const toCopy = path_1.default.join(__dirname, file);
            const destCopy = path_1.default.resolve(path_1.default.join(outDir, file));
            //console.log(toCopy, destCopy);
            (0, fs_1.copyFileSync)(toCopy, destCopy);
        });
    }
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
        return (0, minimatch_1.default)(path, pattern, options);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9vay5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsic3JjL2hleG8vaGV4by1pcy9ob29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkJBQXlFO0FBQ3pFLDBEQUFrQztBQUNsQyxnREFBd0I7QUFFeEIsTUFBTSxLQUFLLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFFcEQsSUFBSSxJQUFBLGVBQVUsRUFBQyxLQUFLLENBQUMsRUFBRTtJQUNyQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUEsaUJBQVksRUFBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzVELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO0lBQy9DLE1BQU0sT0FBTyxHQUFHLElBQUEsZ0JBQVcsRUFBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNyRCxPQUFPLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLElBQUEsZUFBVSxFQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3RCLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN2QixNQUFNLE1BQU0sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQyxNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkQsZ0NBQWdDO1lBQ2hDLElBQUEsaUJBQVksRUFBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLE9BQU87SUFDbEQsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsT0FBTztRQUN2QyxPQUFPLElBQUEsbUJBQVMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvcHlGaWxlU3luYywgZXhpc3RzU3luYywgcmVhZGRpclN5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tIFwibWluaW1hdGNoXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5jb25zdCBsb2N0cyA9IHBhdGguam9pbihfX2Rpcm5hbWUsIFwidHNjb25maWcuanNvblwiKTtcblxuaWYgKGV4aXN0c1N5bmMobG9jdHMpKSB7XG4gIGNvbnN0IHRzY29uZmlnID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMobG9jdHMpLnRvU3RyaW5nKCkpO1xuICBjb25zdCBvdXREaXIgPSB0c2NvbmZpZy5jb21waWxlck9wdGlvbnMub3V0RGlyO1xuICBjb25zdCByZWFkRGlyID0gcmVhZGRpclN5bmMoX19kaXJuYW1lKS5maWx0ZXIoKGZpbGUpID0+IHtcbiAgICByZXR1cm4gbWF0Y2hQYXR0ZXJuTGlzdChmaWxlLCB0c2NvbmZpZy5pbmNsdWRlLCB7IG1hdGNoQmFzZTogdHJ1ZSB9KTtcbiAgfSk7XG5cbiAgaWYgKGV4aXN0c1N5bmMob3V0RGlyKSkge1xuICAgIHJlYWREaXIuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgdG9Db3B5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZSk7XG4gICAgICBjb25zdCBkZXN0Q29weSA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4ob3V0RGlyLCBmaWxlKSk7XG4gICAgICAvL2NvbnNvbGUubG9nKHRvQ29weSwgZGVzdENvcHkpO1xuICAgICAgY29weUZpbGVTeW5jKHRvQ29weSwgZGVzdENvcHkpO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogTWF0Y2ggYSBzaW5nbGUgc3RyaW5nIGFnYWluc3QgYSBsaXN0IG9mIHBhdHRlcm5zXG4gKlxuICogQHBhcmFtIHBhdGggU3RyaW5nIC0gYSBzdHJpbmcgdG8gbWF0Y2hcbiAqIEBwYXJhbSBwYXR0ZXJuTGlzdCBBcnJheSAtIGxpc3Qgb2YgcGF0dGVybnMgdG8gbWF0Y2ggYWdhaW5zdFxuICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0IC0gaGFzaCBvZiBvcHRpb25zIHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gbWluaW1hdGNoKClcbiAqL1xuZnVuY3Rpb24gbWF0Y2hQYXR0ZXJuTGlzdChwYXRoLCBwYXR0ZXJuTGlzdCwgb3B0aW9ucykge1xuICByZXR1cm4gcGF0dGVybkxpc3Quc29tZShmdW5jdGlvbiAocGF0dGVybikge1xuICAgIHJldHVybiBtaW5pbWF0Y2gocGF0aCwgcGF0dGVybiwgb3B0aW9ucyk7XG4gIH0pO1xufVxuIl19