"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.imageBuffer2base64 = exports.getBuffer = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const config_1 = __importDefault(require("../config"));
const log_1 = __importDefault(require("../log"));
const fileType = __importStar(require("file-type"));
const check_1 = __importDefault(require("../curl/check"));
const cheerio_1 = __importDefault(require("cheerio"));
/**
 * Get buffer from source
 * @param src
 * @param hexo
 * @returns
 */
const getBuffer = function (src, hexo) {
    if (typeof src == "string") {
        const base_dir = hexo.base_dir;
        const source_dir = hexo.source_dir;
        let find = src;
        if (!(0, fs_1.existsSync)(src)) {
            if ((0, fs_1.existsSync)(path_1.default.join(source_dir, src))) {
                find = path_1.default.join(source_dir, src);
            }
            else if ((0, fs_1.existsSync)(path_1.default.join(base_dir, src))) {
                find = path_1.default.join(base_dir, src);
            }
        }
        return Buffer.from(find);
    }
    if (Buffer.isBuffer(src))
        return src;
};
exports.getBuffer = getBuffer;
/**
 * Image buffer to base64 encoded
 * @param buffer
 * @returns
 */
const imageBuffer2base64 = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    const type = yield fileType.fromBuffer(buffer);
    return "data:" + type.mime + ";base64," + buffer.toString("base64");
});
exports.imageBuffer2base64 = imageBuffer2base64;
const seoImage = function (
/*$: CheerioAPI*/ content, hexo) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio_1.default.load(content);
        const title = $("title").text();
        const config = (0, config_1.default)(hexo).img;
        //await Promise.all($("img").map(processImg));
        const imgs = $("img");
        if (imgs.length)
            for (let index = 0; index < imgs.length; index++) {
                const img = $(imgs[index]);
                // fix image alt and title
                const img_alt = img.attr("alt");
                const img_title = img.attr("title");
                const img_itemprop = img.attr("itemprop");
                //logger.log("alt", alt);
                if (!img_alt || img_alt.trim().length === 0) {
                    img.attr("alt", (0, sanitize_filename_1.default)(title));
                }
                if (!img_title || img_title.trim().length === 0) {
                    img.attr("title", (0, sanitize_filename_1.default)(title));
                }
                if (!img_itemprop || img_itemprop.trim().length === 0) {
                    img.attr("itemprop", "image");
                }
                const img_src = img.attr("src");
                if (img_src) {
                    // check if image is external
                    const isExternal = /^https?:\/\//gs.test(img_src);
                    if (isExternal) {
                        if (config.onerror == "clientside") {
                            const img_onerror = img.attr("onerror");
                            if (!img_onerror /*|| img_onerror.trim().length === 0*/) {
                                // to avoid image error, and fix endless loop onerror images
                                //const imgBuf = getBuffer(config.default, hexo);
                                //const base64 = await imageBuffer2base64(imgBuf);
                                img.attr("onerror", "this.onerror=null;this.src='" + config.default + "';");
                            }
                        }
                        else {
                            //logger.log("original image", img_src);
                            if (img_src.length > 0) {
                                const check = yield (0, check_1.default)(img_src);
                                if (!check) {
                                    const new_img_src = config.default.toString();
                                    //logger.log("default img", img_src);
                                    log_1.default.debug("%s is broken, replaced with %s", img_src, new_img_src);
                                    img.attr("src", new_img_src);
                                }
                            }
                            img.attr("src-original", img_src);
                        }
                    }
                }
                //const src = img.attr("src");
                //return $;
            }
        return $.html();
    });
};
exports.default = seoImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9pbWcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJCQUFnQztBQUVoQyxnREFBd0I7QUFDeEIsMEVBQWlEO0FBQ2pELHVEQUFrQztBQUNsQyxpREFBNEI7QUFDNUIsb0RBQXNDO0FBQ3RDLDBEQUFxQztBQUNyQyxzREFBOEI7QUFFOUI7Ozs7O0dBS0c7QUFDSSxNQUFNLFNBQVMsR0FBRyxVQUFVLEdBQW9CLEVBQUUsSUFBVTtJQUNqRSxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsRUFBRTtRQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbkMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUEsZUFBVSxFQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLElBQUksSUFBQSxlQUFVLEVBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDMUMsSUFBSSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO2lCQUFNLElBQUksSUFBQSxlQUFVLEVBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDL0MsSUFBSSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Y7UUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDMUI7SUFDRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQUUsT0FBTyxHQUFHLENBQUM7QUFDdkMs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QUN2RCxDQUFDOzZCQUNIO3lCQUNGOzZCQUFNOzRCQUNMLHdDQUF3Qzs0QkFDeEMsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQ0FDdEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFBLGVBQVEsRUFBQyxPQUFPLENBQUMsQ0FBQztnQ0FDdEMsSUFBSSxDQUFDLEtBQUssRUFBRTtvQ0FDVixNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO29DQUM5QyxxQ0FBcUM7b0NBQ3JDLGFBQU0sQ0FBQyxLQUFLLENBQ1YsZ0NBQWdDLEVBQ2hDLE9BQU8sRUFDUCxXQUFXLENBQ1osQ0FBQztvQ0FDRixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztpQ0FDOUI7NkJBQ0Y7NEJBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7eUJBQ25DO3FCQUNGO2lCQUNGO2dCQUNELDhCQUE4QjtnQkFFOUIsV0FBVzthQUNaO1FBRUgsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbEIsQ0FBQztDQUFBLENBQUM7QUFFRixrQkFBZSxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGlzdHNTeW5jIH0gZnJvbSBcImZzXCI7XG5pbXBvcnQgSGV4byBmcm9tIFwiaGV4b1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBzYW5pdGl6ZUZpbGVuYW1lIGZyb20gXCJzYW5pdGl6ZS1maWxlbmFtZVwiO1xuaW1wb3J0IGdldENvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuLi9sb2dcIjtcbmltcG9ydCAqIGFzIGZpbGVUeXBlIGZyb20gXCJmaWxlLXR5cGVcIjtcbmltcG9ydCBjaGVja1VybCBmcm9tIFwiLi4vY3VybC9jaGVja1wiO1xuaW1wb3J0IGNoZWVyaW8gZnJvbSBcImNoZWVyaW9cIjtcblxuLyoqXG4gKiBHZXQgYnVmZmVyIGZyb20gc291cmNlXG4gKiBAcGFyYW0gc3JjXG4gKiBAcGFyYW0gaGV4b1xuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEJ1ZmZlciA9IGZ1bmN0aW9uIChzcmM6IEJ1ZmZlciB8IHN0cmluZywgaGV4bzogSGV4bykge1xuICBpZiAodHlwZW9mIHNyYyA9PSBcInN0cmluZ1wiKSB7XG4gICAgY29uc3QgYmFzZV9kaXIgPSBoZXhvLmJhc2VfZGlyO1xuICAgIGNvbnN0IHNvdXJjZV9kaXIgPSBoZXhvLnNvdXJjZV9kaXI7XG4gICAgbGV0IGZpbmQgPSBzcmM7XG4gICAgaWYgKCFleGlzdHNTeW5jKHNyYykpIHtcbiAgICAgIGlmIChleGlzdHNTeW5jKHBhdGguam9pbihzb3VyY2VfZGlyLCBzcmMpKSkge1xuICAgICAgICBmaW5kID0gcGF0aC5qb2luKHNvdXJjZV9kaXIsIHNyYyk7XG4gICAgICB9IGVsc2UgaWYgKGV4aXN0c1N5bmMocGF0aC5qb2luKGJhc2VfZGlyLCBzcmMpKSkge1xuICAgICAgICBmaW5kID0gcGF0aC5qb2luKGJhc2VfZGlyLCBzcmMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBCdWZmZXIuZnJvbShmaW5kKTtcbiAgfVxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHNyYykpIHJldHVybiBzcmM7XG59O1xuXG4vKipcbiAqIEltYWdlIGJ1ZmZlciB0byBiYXNlNjQgZW5jb2RlZFxuICogQHBhcmFtIGJ1ZmZlclxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGNvbnN0IGltYWdlQnVmZmVyMmJhc2U2NCA9IGFzeW5jIChidWZmZXI6IEJ1ZmZlcikgPT4ge1xuICBjb25zdCB0eXBlID0gYXdhaXQgZmlsZVR5cGUuZnJvbUJ1ZmZlcihidWZmZXIpO1xuXG4gIHJldHVybiBcImRhdGE6XCIgKyB0eXBlLm1pbWUgKyBcIjtiYXNlNjQsXCIgKyBidWZmZXIudG9TdHJpbmcoXCJiYXNlNjRcIik7XG59O1xuXG5jb25zdCBzZW9JbWFnZSA9IGFzeW5jIGZ1bmN0aW9uIChcbiAgLyokOiBDaGVlcmlvQVBJKi8gY29udGVudDogc3RyaW5nLFxuICBoZXhvOiBIZXhvXG4pIHtcbiAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChjb250ZW50KTtcbiAgY29uc3QgdGl0bGUgPSAkKFwidGl0bGVcIikudGV4dCgpO1xuICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoaGV4bykuaW1nO1xuICAvL2F3YWl0IFByb21pc2UuYWxsKCQoXCJpbWdcIikubWFwKHByb2Nlc3NJbWcpKTtcbiAgY29uc3QgaW1ncyA9ICQoXCJpbWdcIik7XG5cbiAgaWYgKGltZ3MubGVuZ3RoKVxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpbWdzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgaW1nID0gJChpbWdzW2luZGV4XSk7XG4gICAgICAvLyBmaXggaW1hZ2UgYWx0IGFuZCB0aXRsZVxuICAgICAgY29uc3QgaW1nX2FsdCA9IGltZy5hdHRyKFwiYWx0XCIpO1xuICAgICAgY29uc3QgaW1nX3RpdGxlID0gaW1nLmF0dHIoXCJ0aXRsZVwiKTtcbiAgICAgIGNvbnN0IGltZ19pdGVtcHJvcCA9IGltZy5hdHRyKFwiaXRlbXByb3BcIik7XG5cbiAgICAgIC8vbG9nZ2VyLmxvZyhcImFsdFwiLCBhbHQpO1xuICAgICAgaWYgKCFpbWdfYWx0IHx8IGltZ19hbHQudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpbWcuYXR0cihcImFsdFwiLCBzYW5pdGl6ZUZpbGVuYW1lKHRpdGxlKSk7XG4gICAgICB9XG4gICAgICBpZiAoIWltZ190aXRsZSB8fCBpbWdfdGl0bGUudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpbWcuYXR0cihcInRpdGxlXCIsIHNhbml0aXplRmlsZW5hbWUodGl0bGUpKTtcbiAgICAgIH1cbiAgICAgIGlmICghaW1nX2l0ZW1wcm9wIHx8IGltZ19pdGVtcHJvcC50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGltZy5hdHRyKFwiaXRlbXByb3BcIiwgXCJpbWFnZVwiKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW1nX3NyYyA9IGltZy5hdHRyKFwic3JjXCIpO1xuICAgICAgaWYgKGltZ19zcmMpIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgaW1hZ2UgaXMgZXh0ZXJuYWxcbiAgICAgICAgY29uc3QgaXNFeHRlcm5hbCA9IC9eaHR0cHM/OlxcL1xcLy9ncy50ZXN0KGltZ19zcmMpO1xuICAgICAgICBpZiAoaXNFeHRlcm5hbCkge1xuICAgICAgICAgIGlmIChjb25maWcub25lcnJvciA9PSBcImNsaWVudHNpZGVcIikge1xuICAgICAgICAgICAgY29uc3QgaW1nX29uZXJyb3IgPSBpbWcuYXR0cihcIm9uZXJyb3JcIik7XG4gICAgICAgICAgICBpZiAoIWltZ19vbmVycm9yIC8qfHwgaW1nX29uZXJyb3IudHJpbSgpLmxlbmd0aCA9PT0gMCovKSB7XG4gICAgICAgICAgICAgIC8vIHRvIGF2b2lkIGltYWdlIGVycm9yLCBhbmQgZml4IGVuZGxlc3MgbG9vcCBvbmVycm9yIGltYWdlc1xuICAgICAgICAgICAgICAvL2NvbnN0IGltZ0J1ZiA9IGdldEJ1ZmZlcihjb25maWcuZGVmYXVsdCwgaGV4byk7XG4gICAgICAgICAgICAgIC8vY29uc3QgYmFzZTY0ID0gYXdhaXQgaW1hZ2VCdWZmZXIyYmFzZTY0KGltZ0J1Zik7XG4gICAgICAgICAgICAgIGltZy5hdHRyKFxuICAgICAgICAgICAgICAgIFwib25lcnJvclwiLFxuICAgICAgICAgICAgICAgIFwidGhpcy5vbmVycm9yPW51bGw7dGhpcy5zcmM9J1wiICsgY29uZmlnLmRlZmF1bHQgKyBcIic7XCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9sb2dnZXIubG9nKFwib3JpZ2luYWwgaW1hZ2VcIiwgaW1nX3NyYyk7XG4gICAgICAgICAgICBpZiAoaW1nX3NyYy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNoZWNrID0gYXdhaXQgY2hlY2tVcmwoaW1nX3NyYyk7XG4gICAgICAgICAgICAgIGlmICghY2hlY2spIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdfaW1nX3NyYyA9IGNvbmZpZy5kZWZhdWx0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgLy9sb2dnZXIubG9nKFwiZGVmYXVsdCBpbWdcIiwgaW1nX3NyYyk7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgICAgICAgICAgICAgXCIlcyBpcyBicm9rZW4sIHJlcGxhY2VkIHdpdGggJXNcIixcbiAgICAgICAgICAgICAgICAgIGltZ19zcmMsXG4gICAgICAgICAgICAgICAgICBuZXdfaW1nX3NyY1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaW1nLmF0dHIoXCJzcmNcIiwgbmV3X2ltZ19zcmMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbWcuYXR0cihcInNyYy1vcmlnaW5hbFwiLCBpbWdfc3JjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vY29uc3Qgc3JjID0gaW1nLmF0dHIoXCJzcmNcIik7XG5cbiAgICAgIC8vcmV0dXJuICQ7XG4gICAgfVxuXG4gIHJldHVybiAkLmh0bWwoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlb0ltYWdlO1xuIl19