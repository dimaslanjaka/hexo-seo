"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagePath = void 0;
require("js-prototypes");
const fixHyperlinks_static_1 = require("./fixHyperlinks.static");
const config_1 = __importDefault(require("../config"));
const cache_1 = require("../cache");
const md5_file_1 = require("../utils/md5-file");
const log_1 = __importDefault(require("../log"));
const bluebird_1 = __importDefault(require("bluebird"));
const node_html_parser_1 = require("node-html-parser");
const types_1 = require("./types");
const url_parse_1 = __importDefault(require("url-parse"));
const __1 = require("..");
const fixSchema_static_1 = __importDefault(require("./fixSchema.static"));
const sitemap_1 = __importDefault(require("../sitemap"));
function getPagePath(data) {
    if (data.page) {
        if (data.page.full_source)
            return data.page.full_source;
        if (data.page.path)
            return data.page.path;
    }
    if (data.path)
        return data.path;
}
exports.getPagePath = getPagePath;
const cache = new cache_1.CacheFile("index");
function default_1(content, data) {
    const hexo = this;
    let path0;
    let allowCache = true;
    if (getPagePath(data)) {
        path0 = getPagePath(data);
    }
    else {
        allowCache = false;
        path0 = content;
    }
    if (cache.isFileChanged((0, md5_file_1.md5)(path0)) || __1.isDev) {
        const root = (0, node_html_parser_1.parse)(content);
        const cfg = (0, config_1.default)(this);
        //** fix hyperlink */
        const a = root.querySelectorAll("a[href]");
        a.forEach((el) => {
            const href = el.getAttribute("href");
            if (/https?:\/\//.test(href)) {
                let rels = el.getAttribute("rel") ? el.getAttribute("rel").split(" ") : [];
                rels = rels.removeEmpties().unique();
                const parseHref = (0, url_parse_1.default)(href);
                const external = (0, types_1.isExternal)(parseHref, hexo);
                rels = (0, fixHyperlinks_static_1.identifyRels)(el, external, cfg.links);
                el.setAttribute("rel", rels.join(" "));
            }
        });
        if (cfg.html.fix) {
            //** fix invalid html */
            const inv = root.querySelectorAll('[href="/.css"],[src="/.js"]');
            if (inv.length)
                log_1.default.log("invalid html found", inv.length, inv.length > 1 ? "items" : "item");
            inv.forEach((el) => {
                el.remove();
            });
        }
        //** fix images attributes */
        const title = data.page && data.page.title && data.page.title.trim().length > 0 ? data.page.title : data.config.title;
        root.querySelectorAll("img[src]").forEach((element) => {
            if (!element.getAttribute("title")) {
                //logger.log("%s(img[title]) fix %s", pkg.name, data.title);
                element.setAttribute("title", title);
            }
            if (!element.getAttribute("alt")) {
                element.setAttribute("alt", title);
            }
            if (!element.getAttribute("itemprop")) {
                element.setAttribute("itemprop", "image");
            }
        });
        (0, fixSchema_static_1.default)(root, cfg, data);
        (0, sitemap_1.default)(root, cfg, data);
        content = root.toString();
        if (allowCache)
            cache.set((0, md5_file_1.md5)(path0), content);
        /*
        dom = new _JSDOM(content);
        fixHyperlinksStatic(dom, cfg.links, data);
        fixInvalidStatic(dom, cfg, data);
        fixAttributes(dom, cfg.img, data);
        fixSchemaStatic(dom, cfg, data);
        if (cfg.html.fix) {
          content = dom.serialize();
        } else {
          content = dom.toString();
        }
    
        return fixBrokenImg(dom, cfg.img, data).then(() => {
          return content;
        });*/
    }
    else {
        content = cache.getCache((0, md5_file_1.md5)(path0), content);
    }
    return bluebird_1.default.resolve(content);
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9odG1sL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLHlCQUF1QjtBQUN2QixpRUFBc0Q7QUFDdEQsdURBQWtDO0FBQ2xDLG9DQUFxQztBQUNyQyxnREFBd0M7QUFDeEMsaURBQTRCO0FBQzVCLHdEQUErQjtBQUMvQix1REFBMkQ7QUFDM0QsbUNBQXFDO0FBQ3JDLDBEQUFpQztBQUNqQywwQkFBMkI7QUFDM0IsMEVBQWlEO0FBQ2pELHlEQUFpQztBQUVqQyxTQUFnQixXQUFXLENBQUMsSUFBOEI7SUFDeEQsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2IsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3hELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztLQUMzQztJQUNELElBQUksSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDbEMsQ0FBQztBQU5ELGtDQU1DO0FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLG1CQUFxQyxPQUFlLEVBQUUsSUFBYTtJQUNqRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbEIsSUFBSSxLQUFhLENBQUM7SUFDbEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3JCLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDM0I7U0FBTTtRQUNMLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsS0FBSyxHQUFHLE9BQU8sQ0FBQztLQUNqQjtJQUVELElBQUksS0FBSyxDQUFDLGFB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QU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ3JDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzNDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFBLDBCQUFlLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFBLGlCQUFPLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV6QixPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLElBQUksVUFBVTtZQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFHLEVBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0M7Ozs7Ozs7Ozs7Ozs7O2FBY0s7S0FDTjtTQUFNO1FBQ0wsT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBQSxjQUFHLEVBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFXLENBQUM7S0FDekQ7SUFFRCxPQUFPLGtCQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUE5RUQsNEJBOEVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhleG8sIHsgVGVtcGxhdGVMb2NhbHMgfSBmcm9tIFwiaGV4b1wiO1xuaW1wb3J0IHsgSGV4b1NlbyB9IGZyb20gXCIuL3NjaGVtYS9hcnRpY2xlXCI7XG5pbXBvcnQgXCJqcy1wcm90b3R5cGVzXCI7XG5pbXBvcnQgeyBpZGVudGlmeVJlbHMgfSBmcm9tIFwiLi9maXhIeXBlcmxpbmtzLnN0YXRpY1wiO1xuaW1wb3J0IGdldENvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyBDYWNoZUZpbGUgfSBmcm9tIFwiLi4vY2FjaGVcIjtcbmltcG9ydCB7IG1kNSB9IGZyb20gXCIuLi91dGlscy9tZDUtZmlsZVwiO1xuaW1wb3J0IGxvZ2dlciBmcm9tIFwiLi4vbG9nXCI7XG5pbXBvcnQgUHJvbWlzZSBmcm9tIFwiYmx1ZWJpcmRcIjtcbmltcG9ydCB7IHBhcnNlIGFzIG5vZGVIdG1sUGFyc2VyIH0gZnJvbSBcIm5vZGUtaHRtbC1wYXJzZXJcIjtcbmltcG9ydCB7IGlzRXh0ZXJuYWwgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHBhcnNlVXJsIGZyb20gXCJ1cmwtcGFyc2VcIjtcbmltcG9ydCB7IGlzRGV2IH0gZnJvbSBcIi4uXCI7XG5pbXBvcnQgZml4U2NoZW1hU3RhdGljIGZyb20gXCIuL2ZpeFNjaGVtYS5zdGF0aWNcIjtcbmltcG9ydCBzaXRlbWFwIGZyb20gXCIuLi9zaXRlbWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWdlUGF0aChkYXRhOiBIZXhvU2VvIHwgVGVtcGxhdGVMb2NhbHMpIHtcbiAgaWYgKGRhdGEucGFnZSkge1xuICAgIGlmIChkYXRhLnBhZ2UuZnVsbF9zb3VyY2UpIHJldHVybiBkYXRhLnBhZ2UuZnVsbF9zb3VyY2U7XG4gICAgaWYgKGRhdGEucGFnZS5wYXRoKSByZXR1cm4gZGF0YS5wYWdlLnBhdGg7XG4gIH1cbiAgaWYgKGRhdGEucGF0aCkgcmV0dXJuIGRhdGEucGF0aDtcbn1cblxuY29uc3QgY2FjaGUgPSBuZXcgQ2FjaGVGaWxlKFwiaW5kZXhcIik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAodGhpczogSGV4bywgY29udGVudDogc3RyaW5nLCBkYXRhOiBIZXhvU2VvKSB7XG4gIGNvbnN0IGhleG8gPSB0aGlzO1xuICBsZXQgcGF0aDA6IHN0cmluZztcbiAgbGV0IGFsbG93Q2FjaGUgPSB0cnVlO1xuICBpZiAoZ2V0UGFnZVBhdGgoZGF0YSkpIHtcbiAgICBwYXRoMCA9IGdldFBhZ2VQYXRoKGRhdGEpO1xuICB9IGVsc2Uge1xuICAgIGFsbG93Q2FjaGUgPSBmYWxzZTtcbiAgICBwYXRoMCA9IGNvbnRlbnQ7XG4gIH1cblxuICBpZiAoY2FjaGUuaXNGaWxlQ2hhbmdlZChtZDUocGF0aDApKSB8fCBpc0Rldikge1xuICAgIGNvbnN0IHJvb3QgPSBub2RlSHRtbFBhcnNlcihjb250ZW50KTtcbiAgICBjb25zdCBjZmcgPSBnZXRDb25maWcodGhpcyk7XG4gICAgLy8qKiBmaXggaHlwZXJsaW5rICovXG4gICAgY29uc3QgYSA9IHJvb3QucXVlcnlTZWxlY3RvckFsbChcImFbaHJlZl1cIik7XG4gICAgYS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgY29uc3QgaHJlZiA9IGVsLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICBpZiAoL2h0dHBzPzpcXC9cXC8vLnRlc3QoaHJlZikpIHtcbiAgICAgICAgbGV0IHJlbHMgPSBlbC5nZXRBdHRyaWJ1dGUoXCJyZWxcIikgPyBlbC5nZXRBdHRyaWJ1dGUoXCJyZWxcIikuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHJlbHMgPSByZWxzLnJlbW92ZUVtcHRpZXMoKS51bmlxdWUoKTtcbiAgICAgICAgY29uc3QgcGFyc2VIcmVmID0gcGFyc2VVcmwoaHJlZik7XG4gICAgICAgIGNvbnN0IGV4dGVybmFsID0gaXNFeHRlcm5hbChwYXJzZUhyZWYsIGhleG8pO1xuICAgICAgICByZWxzID0gaWRlbnRpZnlSZWxzKGVsLCBleHRlcm5hbCwgY2ZnLmxpbmtzKTtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwicmVsXCIsIHJlbHMuam9pbihcIiBcIikpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNmZy5odG1sLmZpeCkge1xuICAgICAgLy8qKiBmaXggaW52YWxpZCBodG1sICovXG4gICAgICBjb25zdCBpbnYgPSByb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tocmVmPVwiLy5jc3NcIl0sW3NyYz1cIi8uanNcIl0nKTtcbiAgICAgIGlmIChpbnYubGVuZ3RoKSBsb2dnZXIubG9nKFwiaW52YWxpZCBodG1sIGZvdW5kXCIsIGludi5sZW5ndGgsIGludi5sZW5ndGggPiAxID8gXCJpdGVtc1wiIDogXCJpdGVtXCIpO1xuICAgICAgaW52LmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGVsLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8qKiBmaXggaW1hZ2VzIGF0dHJpYnV0ZXMgKi9cbiAgICBjb25zdCB0aXRsZSA9XG4gICAgICBkYXRhLnBhZ2UgJiYgZGF0YS5wYWdlLnRpdGxlICYmIGRhdGEucGFnZS50aXRsZS50cmltKCkubGVuZ3RoID4gMCA/IGRhdGEucGFnZS50aXRsZSA6IGRhdGEuY29uZmlnLnRpdGxlO1xuICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbChcImltZ1tzcmNdXCIpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGlmICghZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKSkge1xuICAgICAgICAvL2xvZ2dlci5sb2coXCIlcyhpbWdbdGl0bGVdKSBmaXggJXNcIiwgcGtnLm5hbWUsIGRhdGEudGl0bGUpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIHRpdGxlKTtcbiAgICAgIH1cbiAgICAgIGlmICghZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJhbHRcIikpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgdGl0bGUpO1xuICAgICAgfVxuICAgICAgaWYgKCFlbGVtZW50LmdldEF0dHJpYnV0ZShcIml0ZW1wcm9wXCIpKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiaXRlbXByb3BcIiwgXCJpbWFnZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZpeFNjaGVtYVN0YXRpYyhyb290LCBjZmcsIGRhdGEpO1xuICAgIHNpdGVtYXAocm9vdCwgY2ZnLCBkYXRhKTtcblxuICAgIGNvbnRlbnQgPSByb290LnRvU3RyaW5nKCk7XG4gICAgaWYgKGFsbG93Q2FjaGUpIGNhY2hlLnNldChtZDUocGF0aDApLCBjb250ZW50KTtcbiAgICAvKlxuICAgIGRvbSA9IG5ldyBfSlNET00oY29udGVudCk7XG4gICAgZml4SHlwZXJsaW5rc1N0YXRpYyhkb20sIGNmZy5saW5rcywgZGF0YSk7XG4gICAgZml4SW52YWxpZFN0YXRpYyhkb20sIGNmZywgZGF0YSk7XG4gICAgZml4QXR0cmlidXRlcyhkb20sIGNmZy5pbWcsIGRhdGEpO1xuICAgIGZpeFNjaGVtYVN0YXRpYyhkb20sIGNmZywgZGF0YSk7XG4gICAgaWYgKGNmZy5odG1sLmZpeCkge1xuICAgICAgY29udGVudCA9IGRvbS5zZXJpYWxpemUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGVudCA9IGRvbS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHJldHVybiBmaXhCcm9rZW5JbWcoZG9tLCBjZmcuaW1nLCBkYXRhKS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pOyovXG4gIH0gZWxzZSB7XG4gICAgY29udGVudCA9IGNhY2hlLmdldENhY2hlKG1kNShwYXRoMCksIGNvbnRlbnQpIGFzIHN0cmluZztcbiAgfVxuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoY29udGVudCk7XG59XG4iXX0=