"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const terser_1 = require("terser");
const log_1 = __importDefault(require("../log"));
const package_json_1 = __importDefault(require("../../package.json"));
const cache_1 = __importDefault(require("../cache"));
const object_assign_1 = __importDefault(require("object-assign"));
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
const cache = new cache_1.default();
function default_1(str, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const path0 = data.path;
        if (!path0) {
            log_1.default.error("%s(CSS) invalid path", package_json_1.default.name);
            return;
        }
        const HSConfig = (0, config_1.default)(this).js;
        // if option js is false, return original content
        if (typeof HSConfig == "boolean" && !HSConfig)
            return str;
        const isChanged = yield cache.isFileChanged(path0);
        if (isChanged) {
            // if original file is changed, re-minify js
            const hexo = this;
            let options = {
                exclude: ["*.min.js"]
            };
            if (typeof HSConfig === "boolean") {
                if (!HSConfig)
                    return str;
            }
            else if (typeof HSConfig == "object") {
                options = (0, object_assign_1.default)(options, HSConfig);
                if ((0, utils_1.isIgnore)(path0, options.exclude))
                    return str;
            }
            let minifyOptions = {
                mangle: {
                    toplevel: true,
                    properties: false,
                    safari10: true,
                    keep_fnames: true,
                    keep_classnames: true // keep class name
                },
                compress: {
                    dead_code: true //remove unreachable code
                }
            };
            if (typeof options.options == "object") {
                minifyOptions = (0, object_assign_1.default)(minifyOptions, options.options);
            }
            try {
                const result = yield (0, terser_1.minify)(str, minifyOptions);
                if (result.code && result.code.length > 0) {
                    const saved = (((str.length - result.code.length) / str.length) *
                        100).toFixed(2);
                    log_1.default.log("%s(JS): %s [%s saved]", package_json_1.default.name, path0, `${saved}%`);
                    str = result.code;
                    // set new minified js cache
                    cache.setCache(path0, str);
                }
            }
            catch (e) {
                log_1.default.error(`Minifying ${path0} error`, e);
                // minify error, return original js
                return str;
            }
        }
        else {
            // get cached minified js
            str = yield cache.getCache(path0, str);
        }
        return str;
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9taW5pZmllci9qcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLG1DQUErQztBQUMvQyxpREFBeUI7QUFDekIsc0VBQXFDO0FBQ3JDLHFEQUE2QjtBQUM3QixrRUFBbUM7QUFDbkMsdURBQWtDO0FBQ2xDLG9DQUFvQztBQVVwQyxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBRTFCLG1CQUEyQyxHQUFXLEVBQUUsSUFBZTs7UUFDckUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsYUFBRyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxzQkFBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLE9BQU87U0FDUjtRQUNELE1BQU0sUUFBUSxHQUFHLElBQUEsZ0JBQVMsRUFBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDcEMsaURBQWlEO1FBQ2pELElBQUksT0FBTyxRQUFRLElBQUksU0FBUyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sR0FBRyxDQUFDO1FBQzFELE1BQU0sU0FBUyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRCxJQUFJLFNBQVMsRUFBRTtZQUNiLDRDQUE0QztZQUM1QyxNQUFNLElBQUksR0FBUyxJQUFJLENBQUM7WUFDeEIsSUFBSSxPQUFPLEdBQW9CO2dCQUM3QixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7YUFDdEIsQ0FBQztZQUVGLElBQUksT0FBTyxRQUFRLEtBQUssU0FBUyxFQUFFO2dCQUNqQyxJQUFJLENBQUMsUUFBUTtvQkFBRSxPQUFPLEdBQUcsQ0FBQzthQUMzQjtpQkFBTSxJQUFJLE9BQU8sUUFBUSxJQUFJLFFBQVEsRUFBRTtnQkFDdEMsT0FBTyxHQUFHLElBQUEsdUJBQU0sRUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3BDLElBQUksSUFBQSxnQkFBUSxFQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDO29CQUFFLE9BQU8sR0FBRyxDQUFDO2FBQ2xEO1lBRUQsSUFBSSxhQUFhLEdBQWtCO2dCQUNqQyxNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFLElBQUk7b0JBQ2QsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLFFBQVEsRUFBRSxJQUFJO29CQUNkLFdBQVcsRUFBRSxJQUFJO29CQUNqQixlQUFlLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtpQkFDekM7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLFNBQVMsRUFBRSxJQUFJLENBQUMseUJBQXlCO2lCQUMxQzthQUNGLENBQUM7WUFDRixJQUFJLE9BQU8sT0FBTyxDQUFDLE9BQU8sSUFBSSxRQUFRLEVBQUU7Z0JBQ3RDLGFBQWEsR0FBRyxJQUFBLHVCQUFNLEVBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN4RDtZQUVELElBQUk7Z0JBQ0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLGVBQU0sRUFBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQ2hELElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3pDLE1BQU0sS0FBSyxHQUFHLENBQ1osQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO3dCQUNoRCxHQUFHLENBQ0osQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2IsYUFBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxzQkFBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUMvRCxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFFbEIsNEJBQTRCO29CQUM1QixLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDNUI7YUFDRjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLGFBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxLQUFLLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDekMsbUNBQW1DO2dCQUNuQyxPQUFPLEdBQUcsQ0FBQzthQUNaO1NBQ0Y7YUFBTTtZQUNMLHlCQUF5QjtZQUN6QixHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN4QztRQUVELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztDQUFBO0FBaEVELDRCQWdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIZXhvIGZyb20gXCJoZXhvXCI7XG5pbXBvcnQgeyBtaW5pZnksIE1pbmlmeU9wdGlvbnMgfSBmcm9tIFwidGVyc2VyXCI7XG5pbXBvcnQgbG9nIGZyb20gXCIuLi9sb2dcIjtcbmltcG9ydCBwa2cgZnJvbSBcIi4uLy4uL3BhY2thZ2UuanNvblwiO1xuaW1wb3J0IENhY2hlIGZyb20gXCIuLi9jYWNoZVwiO1xuaW1wb3J0IGFzc2lnbiBmcm9tIFwib2JqZWN0LWFzc2lnblwiO1xuaW1wb3J0IGdldENvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBpc0lnbm9yZSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIGpzTWluaWZ5T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBleGNsdWRlIGpzIHBhdHRlcm5zIGZyb20gbWluaWZ5aW5nXG4gICAqL1xuICBleGNsdWRlPzogc3RyaW5nW107XG4gIG9wdGlvbnM/OiBNaW5pZnlPcHRpb25zO1xufVxuXG5jb25zdCBjYWNoZSA9IG5ldyBDYWNoZSgpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAodGhpczogSGV4bywgc3RyOiBzdHJpbmcsIGRhdGE6IEhleG8uVmlldykge1xuICBjb25zdCBwYXRoMCA9IGRhdGEucGF0aDtcbiAgaWYgKCFwYXRoMCkge1xuICAgIGxvZy5lcnJvcihcIiVzKENTUykgaW52YWxpZCBwYXRoXCIsIHBrZy5uYW1lKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgSFNDb25maWcgPSBnZXRDb25maWcodGhpcykuanM7XG4gIC8vIGlmIG9wdGlvbiBqcyBpcyBmYWxzZSwgcmV0dXJuIG9yaWdpbmFsIGNvbnRlbnRcbiAgaWYgKHR5cGVvZiBIU0NvbmZpZyA9PSBcImJvb2xlYW5cIiAmJiAhSFNDb25maWcpIHJldHVybiBzdHI7XG4gIGNvbnN0IGlzQ2hhbmdlZCA9IGF3YWl0IGNhY2hlLmlzRmlsZUNoYW5nZWQocGF0aDApO1xuICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgLy8gaWYgb3JpZ2luYWwgZmlsZSBpcyBjaGFuZ2VkLCByZS1taW5pZnkganNcbiAgICBjb25zdCBoZXhvOiBIZXhvID0gdGhpcztcbiAgICBsZXQgb3B0aW9uczoganNNaW5pZnlPcHRpb25zID0ge1xuICAgICAgZXhjbHVkZTogW1wiKi5taW4uanNcIl1cbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBIU0NvbmZpZyA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgIGlmICghSFNDb25maWcpIHJldHVybiBzdHI7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgSFNDb25maWcgPT0gXCJvYmplY3RcIikge1xuICAgICAgb3B0aW9ucyA9IGFzc2lnbihvcHRpb25zLCBIU0NvbmZpZyk7XG4gICAgICBpZiAoaXNJZ25vcmUocGF0aDAsIG9wdGlvbnMuZXhjbHVkZSkpIHJldHVybiBzdHI7XG4gICAgfVxuXG4gICAgbGV0IG1pbmlmeU9wdGlvbnM6IE1pbmlmeU9wdGlvbnMgPSB7XG4gICAgICBtYW5nbGU6IHtcbiAgICAgICAgdG9wbGV2ZWw6IHRydWUsIC8vIHRvIG1hbmdsZSBuYW1lcyBkZWNsYXJlZCBpbiB0aGUgdG9wIGxldmVsIHNjb3BlLlxuICAgICAgICBwcm9wZXJ0aWVzOiBmYWxzZSwgLy8gZGlzYWJsZSBtYW5nbGUgb2JqZWN0IGFuZCBhcnJheSBwcm9wZXJ0aWVzXG4gICAgICAgIHNhZmFyaTEwOiB0cnVlLCAvLyB0byB3b3JrIGFyb3VuZCB0aGUgU2FmYXJpIDEwIGxvb3AgaXRlcmF0b3JcbiAgICAgICAga2VlcF9mbmFtZXM6IHRydWUsIC8vIGtlZXAgZnVuY3Rpb24gbmFtZXNcbiAgICAgICAga2VlcF9jbGFzc25hbWVzOiB0cnVlIC8vIGtlZXAgY2xhc3MgbmFtZVxuICAgICAgfSxcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRlYWRfY29kZTogdHJ1ZSAvL3JlbW92ZSB1bnJlYWNoYWJsZSBjb2RlXG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMub3B0aW9ucyA9PSBcIm9iamVjdFwiKSB7XG4gICAgICBtaW5pZnlPcHRpb25zID0gYXNzaWduKG1pbmlmeU9wdGlvbnMsIG9wdGlvbnMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG1pbmlmeShzdHIsIG1pbmlmeU9wdGlvbnMpO1xuICAgICAgaWYgKHJlc3VsdC5jb2RlICYmIHJlc3VsdC5jb2RlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3Qgc2F2ZWQgPSAoXG4gICAgICAgICAgKChzdHIubGVuZ3RoIC0gcmVzdWx0LmNvZGUubGVuZ3RoKSAvIHN0ci5sZW5ndGgpICpcbiAgICAgICAgICAxMDBcbiAgICAgICAgKS50b0ZpeGVkKDIpO1xuICAgICAgICBsb2cubG9nKFwiJXMoSlMpOiAlcyBbJXMgc2F2ZWRdXCIsIHBrZy5uYW1lLCBwYXRoMCwgYCR7c2F2ZWR9JWApO1xuICAgICAgICBzdHIgPSByZXN1bHQuY29kZTtcblxuICAgICAgICAvLyBzZXQgbmV3IG1pbmlmaWVkIGpzIGNhY2hlXG4gICAgICAgIGNhY2hlLnNldENhY2hlKHBhdGgwLCBzdHIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZy5lcnJvcihgTWluaWZ5aW5nICR7cGF0aDB9IGVycm9yYCwgZSk7XG4gICAgICAvLyBtaW5pZnkgZXJyb3IsIHJldHVybiBvcmlnaW5hbCBqc1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gZ2V0IGNhY2hlZCBtaW5pZmllZCBqc1xuICAgIHN0ciA9IGF3YWl0IGNhY2hlLmdldENhY2hlKHBhdGgwLCBzdHIpO1xuICB9XG5cbiAgcmV0dXJuIHN0cjtcbn1cbiJdfQ==