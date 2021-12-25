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
        log_1.default.error("seo options not found");
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
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7OztBQUdiLHVEQUFrQztBQUNsQyx5REFBb0M7QUFDcEMsd0RBQWdDO0FBQ2hDLG9EQUE0QjtBQUM1QixtRUFBa0M7QUFDbEMsNkJBQThDO0FBQzlDLHlEQUFxQztBQUNyQyw4REFBOEM7QUFDOUMsNERBQW9DO0FBQ3BDLGdEQUF3QjtBQUN4QixzREFBaUM7QUFFakMsTUFBTSxJQUFJLEdBQUcsSUFBQSxrQkFBUSxFQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFN0MsZ0JBQWdCO0FBQ2hCLE1BQU0sR0FBRyxHQUFHLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFM0UsK0JBQStCO0FBQy9CLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxLQUFLLGFBQWEsQ0FBQztBQUVwRyx3QkFBd0I7QUFDWCxRQUFBLEtBQUssR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDO0FBRWhDLE9BQU87QUFDUCxtQkFBeUIsSUFBVTtJQUNqQywrQ0FBK0M7SUFDL0MsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLFdBQVcsRUFBRTtRQUN6QyxhQUFHLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDbkMsT0FBTztLQUNSO0lBRUQsSUFBSSxPQUFlLENBQUM7SUFDcEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFD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QU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLGVBQVMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFqRUQsNEJBaUVDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBIZXhvIGZyb20gXCJoZXhvXCI7XG5pbXBvcnQgc2VvSnMgZnJvbSBcIi4vbWluaWZpZXIvanNcIjtcbmltcG9ydCBzZW9Dc3MgZnJvbSBcIi4vbWluaWZpZXIvY3NzXCI7XG5pbXBvcnQgbWluaW1pc3QgZnJvbSBcIm1pbmltaXN0XCI7XG5pbXBvcnQgcmltcmFmIGZyb20gXCJyaW1yYWZcIjtcbmltcG9ydCBwa2cgZnJvbSBcIi4uL3BhY2thZ2UuanNvblwiO1xuaW1wb3J0IHsgYnVpbGRGb2xkZXIsIHRtcEZvbGRlciB9IGZyb20gXCIuL2ZtXCI7XG5pbXBvcnQgaHRtbEluZGV4IGZyb20gXCIuL2h0bWwvaW5kZXhcIjtcbmltcG9ydCBiaW5kUHJvY2Vzc0V4aXQgZnJvbSBcIi4vdXRpbHMvY2xlYW51cFwiO1xuaW1wb3J0IHNjaGVkdWxlciBmcm9tIFwiLi9zY2hlZHVsZXJcIjtcbmltcG9ydCBsb2cgZnJvbSBcIi4vbG9nXCI7XG5pbXBvcnQgZ2V0Q29uZmlnIGZyb20gXCIuL2NvbmZpZ1wiO1xuXG5jb25zdCBhcmd2ID0gbWluaW1pc3QocHJvY2Vzcy5hcmd2LnNsaWNlKDIpKTtcblxuLy8gLS1kZXZlbG9wbWVudFxuY29uc3QgYXJnID0gdHlwZW9mIGFyZ3ZbXCJkZXZlbG9wbWVudFwiXSA9PSBcImJvb2xlYW5cIiAmJiBhcmd2W1wiZGV2ZWxvcG1lbnRcIl07XG5cbi8vIHNldCBOT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuY29uc3QgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09PSBcImRldmVsb3BtZW50XCI7XG5cbi8vIGRlZmluZSBpcyBkZXZlbG9wbWVudFxuZXhwb3J0IGNvbnN0IGlzRGV2ID0gYXJnIHx8IGVudjtcblxuLy8gY29yZVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGhleG86IEhleG8pIHtcbiAgLy8gcmV0dXJuIGlmIGhleG8tc2VvIGNvbmZpZ3VyYXRpb24gdW5hdmFpbGFibGVcbiAgaWYgKHR5cGVvZiBoZXhvLmNvbmZpZy5zZW8gPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGxvZy5lcnJvcihcInNlbyBvcHRpb25zIG5vdCBmb3VuZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgaGV4b0NtZDogc3RyaW5nO1xuICBpZiAoaGV4by5lbnYuYXJncy5fICYmIGhleG8uZW52LmFyZ3MuXy5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoZXhvLmVudi5hcmdzLl8ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChoZXhvLmVudi5hcmdzLl9baV0gPT0gXCJzXCIgfHwgaGV4by5lbnYuYXJncy5fW2ldID09IFwic2VydmVyXCIpIHtcbiAgICAgICAgaGV4b0NtZCA9IFwic2VydmVyXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKGhleG8uZW52LmFyZ3MuX1tpXSA9PSBcImRcIiB8fCBoZXhvLmVudi5hcmdzLl9baV0gPT0gXCJkZXBsb3lcIikge1xuICAgICAgICBoZXhvQ21kID0gXCJkZXBsb3lcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaGV4by5lbnYuYXJncy5fW2ldID09IFwiZ1wiIHx8IGhleG8uZW52LmFyZ3MuX1tpXSA9PSBcImdlbmVyYXRlXCIpIHtcbiAgICAgICAgaGV4b0NtZCA9IFwiZ2VuZXJhdGVcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaGV4by5lbnYuYXJncy5fW2ldID09IFwiY2xlYW5cIikge1xuICAgICAgICBoZXhvQ21kID0gXCJjbGVhblwiO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBjbGVhbiBidWlsZCBhbmQgdGVtcCBmb2xkZXIgb24gYGhleG8gY2xlYW5gXG4gIGlmIChoZXhvQ21kICYmIGhleG9DbWQgPT0gXCJjbGVhblwiKSB7XG4gICAgY29uc29sZS5sb2coXCIlcyBjbGVhbmluZyBidWlsZCBhbmQgdGVtcCBmb2xkZXJcIiwgcGtnLm5hbWUpO1xuICAgIHJpbXJhZih0bXBGb2xkZXIsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGVhbmVkXCIsIHRtcEZvbGRlcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmltcmFmKGJ1aWxkRm9sZGVyLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xlYW5lZFwiLCBidWlsZEZvbGRlcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGV4ZWN1dGUgc2NoZWR1bGVkIGZ1bmN0aW9ucyBiZWZvcmUgcHJvY2VzcyBleGl0XG4gIGlmIChoZXhvQ21kICYmIGhleG9DbWQgIT0gXCJjbGVhblwiKSB7XG4gICAgYmluZFByb2Nlc3NFeGl0KFwic2NoZWR1bGVyX29uX2V4aXRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgbG9nLmxvZyhcImV4ZWN1dGluZyBzY2hlZHVsZWQgZnVuY3Rpb25zXCIpO1xuICAgICAgc2NoZWR1bGVyLmV4ZWN1dGVBbGwoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGJpbmQgY29uZmlndXJhdGlvblxuICBoZXhvLmNvbmZpZy5zZW8gPSBnZXRDb25maWcoaGV4byk7XG5cbiAgLy8gbWluaWZ5IGphdmFzY3JpcHRzXG4gIGhleG8uZXh0ZW5kLmZpbHRlci5yZWdpc3RlcihcImFmdGVyX3JlbmRlcjpqc1wiLCBzZW9Kcyk7XG4gIC8vIG1pbmlmeSBjc3NcbiAgaGV4by5leHRlbmQuZmlsdGVyLnJlZ2lzdGVyKFwiYWZ0ZXJfcmVuZGVyOmNzc1wiLCBzZW9Dc3MpO1xuICAvLyBhbGwgaW4gb25lIGh0bWwgZml4ZXJcbiAgaGV4by5leHRlbmQuZmlsdGVyLnJlZ2lzdGVyKFwiYWZ0ZXJfcmVuZGVyOmh0bWxcIiwgaHRtbEluZGV4KTtcbn1cbiJdfQ==