"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = void 0;
const js_1 = __importDefault(require("./minifier/js"));
const css_1 = __importDefault(require("./minifier/css"));
const minimist_1 = __importDefault(require("minimist"));
const rimraf_1 = __importDefault(require("rimraf"));
const package_json_1 = __importDefault(require("../package.json"));
const fm_1 = require("./fm");
const index_1 = __importDefault(require("./html/index"));
const cleanup_1 = __importDefault(require("./utils/cleanup"));
const scheduler_1 = __importDefault(require("./scheduler"));
const log_1 = __importDefault(require("./log"));
const config_1 = __importDefault(require("./config"));
const argv = (0, minimist_1.default)(process.argv.slice(2));
// --development
const arg = typeof argv["development"] == "boolean" && argv["development"];
// set NODE_ENV = "development"
const env = process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase() === "development";
// define is development
exports.isDev = arg || env;
// core
function default_1(hexo) {
    // return if hexo-seo configuration unavailable
    if (typeof hexo.config.seo == "undefined") {
        console.error("ERROR", "seo options not found");
        return;
    }
    let hexoCmd;
    if (hexo.env.args._ && hexo.env.args._.length > 0) {
        for (let i = 0; i < hexo.env.args._.length; i++) {
            if (hexo.env.args._[i] == "s" || hexo.env.args._[i] == "server") {
                hexoCmd = "server";
                break;
            }
            if (hexo.env.args._[i] == "d" || hexo.env.args._[i] == "deploy") {
                hexoCmd = "deploy";
                break;
            }
            if (hexo.env.args._[i] == "g" || hexo.env.args._[i] == "generate") {
                hexoCmd = "generate";
                break;
            }
            if (hexo.env.args._[i] == "clean") {
                hexoCmd = "clean";
                break;
            }
        }
    }
    // clean build and temp folder on `hexo clean`
    if (hexoCmd && hexoCmd == "clean") {
        console.log("%s cleaning build and temp folder", package_json_1.default.name);
        (0, rimraf_1.default)(fm_1.tmpFolder, function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log("cleaned", fm_1.tmpFolder);
            }
        });
        (0, rimraf_1.default)(fm_1.buildFolder, function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log("cleaned", fm_1.buildFolder);
            }
        });
        return;
    }
    // execute scheduled functions before process exit
    if (hexoCmd && hexoCmd != "clean") {
        (0, cleanup_1.default)("scheduler_on_exit", function () {
            log_1.default.log("executing scheduled functions");
            scheduler_1.default.executeAll();
        });
    }
    // bind configuration
    hexo.config.seo = (0, config_1.default)(hexo);
    // minify javascripts
    hexo.extend.filter.register("after_render:js", js_1.default);
    // minify css
    hexo.extend.filter.register("after_render:css", css_1.default);
    // all in one html fixer
    hexo.extend.filter.register("after_render:html", index_1.default);
    // register source to hexo middleware
    // hexo-seo available in server http://localhost:4000/hexo-seo
    /*hexo.extend.filter.register("server_middleware", function (app) {
      // Main routes
      app.use(hexo.config.root, serveStatic(path.join(__dirname, "../source")));
    });*/
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgub2xkLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJzcmMvaW5kZXgub2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7O0FBR2IsdURBQWtDO0FBQ2xDLHlEQUFvQztBQUNwQyx3REFBZ0M7QUFDaEMsb0RBQTRCO0FBQzVCLG1FQUFrQztBQUNsQyw2QkFBOEM7QUFDOUMseURBQXFDO0FBQ3JDLDhEQUE4QztBQUM5Qyw0REFBb0M7QUFDcEMsZ0RBQXdCO0FBQ3hCLHNEQUFpQztBQUVqQyxNQUFNLElBQUksR0FBRyxJQUFBLGtCQUFRLEVBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUU3QyxnQkFBZ0I7QUFDaEIsTUFBTSxHQUFHLEdBQUcsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUUzRSwrQkFBK0I7QUFDL0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLEtBQUssYUFBYSxDQUFDO0FBRXBHLHdCQUF3QjtBQUNYLFFBQUEsS0FBSyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUM7QUFFaEMsT0FBTztBQUNQLG1CQUF5QixJQUFVO0lBQ2pDLCtDQUErQztJQUMvQyxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksV0FBVyxFQUFFO1FBQ3pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDaEQsT0FBTztLQUNSO0lBRUQsSUFBSSxPQUFlLENBQUM7SUFDcEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJ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SUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLGVBQVMsQ0FBQyxDQUFDO0lBRTVELHFDQUFxQztJQUNyQyw4REFBOEQ7SUFDOUQ7OztTQUdLO0FBQ1AsQ0FBQztBQXhFRCw0QkF3RUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEhleG8gZnJvbSBcImhleG9cIjtcbmltcG9ydCBzZW9KcyBmcm9tIFwiLi9taW5pZmllci9qc1wiO1xuaW1wb3J0IHNlb0NzcyBmcm9tIFwiLi9taW5pZmllci9jc3NcIjtcbmltcG9ydCBtaW5pbWlzdCBmcm9tIFwibWluaW1pc3RcIjtcbmltcG9ydCByaW1yYWYgZnJvbSBcInJpbXJhZlwiO1xuaW1wb3J0IHBrZyBmcm9tIFwiLi4vcGFja2FnZS5qc29uXCI7XG5pbXBvcnQgeyBidWlsZEZvbGRlciwgdG1wRm9sZGVyIH0gZnJvbSBcIi4vZm1cIjtcbmltcG9ydCBodG1sSW5kZXggZnJvbSBcIi4vaHRtbC9pbmRleFwiO1xuaW1wb3J0IGJpbmRQcm9jZXNzRXhpdCBmcm9tIFwiLi91dGlscy9jbGVhbnVwXCI7XG5pbXBvcnQgc2NoZWR1bGVyIGZyb20gXCIuL3NjaGVkdWxlclwiO1xuaW1wb3J0IGxvZyBmcm9tIFwiLi9sb2dcIjtcbmltcG9ydCBnZXRDb25maWcgZnJvbSBcIi4vY29uZmlnXCI7XG5cbmNvbnN0IGFyZ3YgPSBtaW5pbWlzdChwcm9jZXNzLmFyZ3Yuc2xpY2UoMikpO1xuXG4vLyAtLWRldmVsb3BtZW50XG5jb25zdCBhcmcgPSB0eXBlb2YgYXJndltcImRldmVsb3BtZW50XCJdID09IFwiYm9vbGVhblwiICYmIGFyZ3ZbXCJkZXZlbG9wbWVudFwiXTtcblxuLy8gc2V0IE5PREVfRU5WID0gXCJkZXZlbG9wbWVudFwiXG5jb25zdCBlbnYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAmJiBwcm9jZXNzLmVudi5OT0RFX0VOVi50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT09IFwiZGV2ZWxvcG1lbnRcIjtcblxuLy8gZGVmaW5lIGlzIGRldmVsb3BtZW50XG5leHBvcnQgY29uc3QgaXNEZXYgPSBhcmcgfHwgZW52O1xuXG4vLyBjb3JlXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoaGV4bzogSGV4bykge1xuICAvLyByZXR1cm4gaWYgaGV4by1zZW8gY29uZmlndXJhdGlvbiB1bmF2YWlsYWJsZVxuICBpZiAodHlwZW9mIGhleG8uY29uZmlnLnNlbyA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVSUk9SXCIsIFwic2VvIG9wdGlvbnMgbm90IGZvdW5kXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBoZXhvQ21kOiBzdHJpbmc7XG4gIGlmIChoZXhvLmVudi5hcmdzLl8gJiYgaGV4by5lbnYuYXJncy5fLmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhleG8uZW52LmFyZ3MuXy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGhleG8uZW52LmFyZ3MuX1tpXSA9PSBcInNcIiB8fCBoZXhvLmVudi5hcmdzLl9baV0gPT0gXCJzZXJ2ZXJcIikge1xuICAgICAgICBoZXhvQ21kID0gXCJzZXJ2ZXJcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaGV4by5lbnYuYXJncy5fW2ldID09IFwiZFwiIHx8IGhleG8uZW52LmFyZ3MuX1tpXSA9PSBcImRlcGxveVwiKSB7XG4gICAgICAgIGhleG9DbWQgPSBcImRlcGxveVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChoZXhvLmVudi5hcmdzLl9baV0gPT0gXCJnXCIgfHwgaGV4by5lbnYuYXJncy5fW2ldID09IFwiZ2VuZXJhdGVcIikge1xuICAgICAgICBoZXhvQ21kID0gXCJnZW5lcmF0ZVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChoZXhvLmVudi5hcmdzLl9baV0gPT0gXCJjbGVhblwiKSB7XG4gICAgICAgIGhleG9DbWQgPSBcImNsZWFuXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGNsZWFuIGJ1aWxkIGFuZCB0ZW1wIGZvbGRlciBvbiBgaGV4byBjbGVhbmBcbiAgaWYgKGhleG9DbWQgJiYgaGV4b0NtZCA9PSBcImNsZWFuXCIpIHtcbiAgICBjb25zb2xlLmxvZyhcIiVzIGNsZWFuaW5nIGJ1aWxkIGFuZCB0ZW1wIGZvbGRlclwiLCBwa2cubmFtZSk7XG4gICAgcmltcmFmKHRtcEZvbGRlciwgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcImNsZWFuZWRcIiwgdG1wRm9sZGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByaW1yYWYoYnVpbGRGb2xkZXIsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGVhbmVkXCIsIGJ1aWxkRm9sZGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gZXhlY3V0ZSBzY2hlZHVsZWQgZnVuY3Rpb25zIGJlZm9yZSBwcm9jZXNzIGV4aXRcbiAgaWYgKGhleG9DbWQgJiYgaGV4b0NtZCAhPSBcImNsZWFuXCIpIHtcbiAgICBiaW5kUHJvY2Vzc0V4aXQoXCJzY2hlZHVsZXJfb25fZXhpdFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2cubG9nKFwiZXhlY3V0aW5nIHNjaGVkdWxlZCBmdW5jdGlvbnNcIik7XG4gICAgICBzY2hlZHVsZXIuZXhlY3V0ZUFsbCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gYmluZCBjb25maWd1cmF0aW9uXG4gIGhleG8uY29uZmlnLnNlbyA9IGdldENvbmZpZyhoZXhvKTtcblxuICAvLyBtaW5pZnkgamF2YXNjcmlwdHNcbiAgaGV4by5leHRlbmQuZmlsdGVyLnJlZ2lzdGVyKFwiYWZ0ZXJfcmVuZGVyOmpzXCIsIHNlb0pzKTtcbiAgLy8gbWluaWZ5IGNzc1xuICBoZXhvLmV4dGVuZC5maWx0ZXIucmVnaXN0ZXIoXCJhZnRlcl9yZW5kZXI6Y3NzXCIsIHNlb0Nzcyk7XG4gIC8vIGFsbCBpbiBvbmUgaHRtbCBmaXhlclxuICBoZXhvLmV4dGVuZC5maWx0ZXIucmVnaXN0ZXIoXCJhZnRlcl9yZW5kZXI6aHRtbFwiLCBodG1sSW5kZXgpO1xuXG4gIC8vIHJlZ2lzdGVyIHNvdXJjZSB0byBoZXhvIG1pZGRsZXdhcmVcbiAgLy8gaGV4by1zZW8gYXZhaWxhYmxlIGluIHNlcnZlciBodHRwOi8vbG9jYWxob3N0OjQwMDAvaGV4by1zZW9cbiAgLypoZXhvLmV4dGVuZC5maWx0ZXIucmVnaXN0ZXIoXCJzZXJ2ZXJfbWlkZGxld2FyZVwiLCBmdW5jdGlvbiAoYXBwKSB7XG4gICAgLy8gTWFpbiByb3V0ZXNcbiAgICBhcHAudXNlKGhleG8uY29uZmlnLnJvb3QsIHNlcnZlU3RhdGljKHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vc291cmNlXCIpKSk7XG4gIH0pOyovXG59XG4iXX0=