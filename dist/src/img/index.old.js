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
const log_1 = __importDefault(require("../log"));
const config_1 = __importDefault(require("../config"));
const minimatch_1 = __importDefault(require("minimatch"));
const utils_1 = require("../utils");
const stream_1 = require("../utils/stream");
const cheerio_1 = __importDefault(require("cheerio"));
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        const hexo = this;
        const route = hexo.route;
        const options = (0, config_1.default)(hexo).img;
        // Filter routes to select all html files.
        const routes = route.list().filter(function (path0) {
            let choose = (0, minimatch_1.default)(path0, "**/*.{htm,html}", { nocase: true });
            if (typeof options == "object" && typeof options.exclude != "undefined") {
                choose = choose && !(0, utils_1.isIgnore)(path0, options.exclude);
            }
            if (typeof hexo.config.skip_render != "undefined") {
                // _config.yml skip_render https://hexo.io/docs/configuration.html#Directory
                choose = choose && !(0, utils_1.isIgnore)(path0, hexo.config.skip_render);
            }
            return choose;
        });
        const processor = (stream) => {
            (0, stream_1.streamToArray)(stream)
                .then((arr) => {
                return arr.join("");
            })
                .then((str) => {
                try {
                    //dump("after_generate.txt", str);
                    //logger.log(typeof str, "str");
                    const $ = cheerio_1.default.load(str);
                    const title = $("title").text();
                    $("img").map(function (i, img) {
                        // fix image alt
                        const alt = $(img).attr("alt");
                        if (!alt || alt.trim().length === 0) {
                            $(img).attr("alt", title);
                        }
                        //const src = $(img).attr("src");
                    });
                }
                catch (e) {
                    log_1.default.error(e);
                }
                return str;
            });
        };
        /*return bPromise.map(routes, (path0) => {
          const stream = route.get(path0);
          return processor(stream);
        });*/
        return routes.map((path0, index, arr) => {
            const stream = route.get(path0);
            return processor(stream);
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgub2xkLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJzcmMvaW1nL2luZGV4Lm9sZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLGlEQUE0QjtBQUM1Qix1REFBa0M7QUFDbEMsMERBQWtDO0FBQ2xDLG9DQUFvQztBQUNwQyw0Q0FBZ0Q7QUFDaEQsc0RBQThCO0FBbUI5Qjs7UUFDRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixNQUFNLE9BQU8sR0FBRyxJQUFBLGdCQUFTLEVBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3BDLDBDQUEwQztRQUMxQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSztZQUNoRCxJQUFJLE1BQU0sR0FBRyxJQUFBLG1CQUFTLEVBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDbkUsSUFBSSxPQUFPLE9BQU8sSUFBSSxRQUFRLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxJQUFJLFdBQVcsRUFBRTtnQkFDdkUsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUEsZ0JBQVEsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3REO1lBQ0QsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLFdBQVcsRUFBRTtnQkFDakQsNEVBQTRFO2dCQUM1RSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBQSxnQkFBUSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzlEO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFO1lBQ25DLElBQUEsc0JBQWEsRUFBQyxNQUFNLENBQUM7aUJBQ2xCLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNaLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ1osSUFBSTtvQkFDRixrQ0FBa0M7b0JBQ2xDLGdDQUFnQztvQkFDaEMsTUFBTSxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzVCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHO3dCQUMzQixnQkFBZ0I7d0JBQ2hCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQy9CLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQ25DLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO3lCQUMzQjt3QkFDRCxpQ0FBaUM7b0JBQ25DLENBQUMsQ0FBQyxDQUFDO2lCQUNKO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNWLGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2pCO2dCQUVELE9BQU8sR0FBRyxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFFRjs7O2FBR0s7UUFFTCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFyREQsNEJBcURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhleG8gZnJvbSBcImhleG9cIjtcbmltcG9ydCBsb2dnZXIgZnJvbSBcIi4uL2xvZ1wiO1xuaW1wb3J0IGdldENvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgbWluaW1hdGNoIGZyb20gXCJtaW5pbWF0Y2hcIjtcbmltcG9ydCB7IGlzSWdub3JlIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgeyBzdHJlYW1Ub0FycmF5IH0gZnJvbSBcIi4uL3V0aWxzL3N0cmVhbVwiO1xuaW1wb3J0IGNoZWVyaW8gZnJvbSBcImNoZWVyaW9cIjtcbmltcG9ydCB7IFN0cmVhbSB9IGZyb20gXCJzdHJlYW1cIjtcblxuZXhwb3J0IGludGVyZmFjZSBpbWdPcHRpb25zIHtcbiAgLyoqXG4gICAqIGV4Y2x1ZGUgaW1hZ2UgcGF0dGVybnMgZnJvbSBvcHRpbWl6YXRpb25cbiAgICovXG4gIGV4Y2x1ZGU/OiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIHJlcGxhY2UgYnJva2VuIGltYWdlcyB3aXRoIGRlZmF1bHQgb25lc1xuICAgKi9cbiAgYnJva2VuPzogYm9vbGVhbiB8IHsgc3RyaW5nOiBzdHJpbmcgfVtdO1xuICAvKipcbiAgICogZGVmYXVsdCBpbWFnZSBmYWxsYmFja1xuICAgKi9cbiAgZGVmYXVsdD86IHN0cmluZyB8IEJ1ZmZlcjtcbiAgb25lcnJvcj86IFwic2VydmVyc2lkZVwiIHwgXCJjbGllbnRzaWRlXCI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uICh0aGlzOiBIZXhvKSB7XG4gIGNvbnN0IGhleG8gPSB0aGlzO1xuICBjb25zdCByb3V0ZSA9IGhleG8ucm91dGU7XG4gIGNvbnN0IG9wdGlvbnMgPSBnZXRDb25maWcoaGV4bykuaW1nO1xuICAvLyBGaWx0ZXIgcm91dGVzIHRvIHNlbGVjdCBhbGwgaHRtbCBmaWxlcy5cbiAgY29uc3Qgcm91dGVzID0gcm91dGUubGlzdCgpLmZpbHRlcihmdW5jdGlvbiAocGF0aDApIHtcbiAgICBsZXQgY2hvb3NlID0gbWluaW1hdGNoKHBhdGgwLCBcIioqLyoue2h0bSxodG1sfVwiLCB7IG5vY2FzZTogdHJ1ZSB9KTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb3B0aW9ucy5leGNsdWRlICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGNob29zZSA9IGNob29zZSAmJiAhaXNJZ25vcmUocGF0aDAsIG9wdGlvbnMuZXhjbHVkZSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgaGV4by5jb25maWcuc2tpcF9yZW5kZXIgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgLy8gX2NvbmZpZy55bWwgc2tpcF9yZW5kZXIgaHR0cHM6Ly9oZXhvLmlvL2RvY3MvY29uZmlndXJhdGlvbi5odG1sI0RpcmVjdG9yeVxuICAgICAgY2hvb3NlID0gY2hvb3NlICYmICFpc0lnbm9yZShwYXRoMCwgaGV4by5jb25maWcuc2tpcF9yZW5kZXIpO1xuICAgIH1cbiAgICByZXR1cm4gY2hvb3NlO1xuICB9KTtcblxuICBjb25zdCBwcm9jZXNzb3IgPSAoc3RyZWFtOiBTdHJlYW0pID0+IHtcbiAgICBzdHJlYW1Ub0FycmF5KHN0cmVhbSlcbiAgICAgIC50aGVuKChhcnIpID0+IHtcbiAgICAgICAgcmV0dXJuIGFyci5qb2luKFwiXCIpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKChzdHIpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvL2R1bXAoXCJhZnRlcl9nZW5lcmF0ZS50eHRcIiwgc3RyKTtcbiAgICAgICAgICAvL2xvZ2dlci5sb2codHlwZW9mIHN0ciwgXCJzdHJcIik7XG4gICAgICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChzdHIpO1xuICAgICAgICAgIGNvbnN0IHRpdGxlID0gJChcInRpdGxlXCIpLnRleHQoKTtcbiAgICAgICAgICAkKFwiaW1nXCIpLm1hcChmdW5jdGlvbiAoaSwgaW1nKSB7XG4gICAgICAgICAgICAvLyBmaXggaW1hZ2UgYWx0XG4gICAgICAgICAgICBjb25zdCBhbHQgPSAkKGltZykuYXR0cihcImFsdFwiKTtcbiAgICAgICAgICAgIGlmICghYWx0IHx8IGFsdC50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICQoaW1nKS5hdHRyKFwiYWx0XCIsIHRpdGxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vY29uc3Qgc3JjID0gJChpbWcpLmF0dHIoXCJzcmNcIik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfSk7XG4gIH07XG5cbiAgLypyZXR1cm4gYlByb21pc2UubWFwKHJvdXRlcywgKHBhdGgwKSA9PiB7XG4gICAgY29uc3Qgc3RyZWFtID0gcm91dGUuZ2V0KHBhdGgwKTtcbiAgICByZXR1cm4gcHJvY2Vzc29yKHN0cmVhbSk7XG4gIH0pOyovXG5cbiAgcmV0dXJuIHJvdXRlcy5tYXAoKHBhdGgwLCBpbmRleCwgYXJyKSA9PiB7XG4gICAgY29uc3Qgc3RyZWFtID0gcm91dGUuZ2V0KHBhdGgwKTtcbiAgICByZXR1cm4gcHJvY2Vzc29yKHN0cmVhbSk7XG4gIH0pO1xufVxuIl19