"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("../utils/string");
const article_1 = __importDefault(require("./schema/article"));
const __1 = require("..");
const dom_1 = require("./dom");
require("js-prototypes");
const underscore_1 = __importDefault(require("underscore"));
const utils_1 = require("../utils");
const hexo_is_1 = __importDefault(require("../hexo/hexo-is"));
const homepage_1 = __importDefault(require("./schema/homepage"));
const log_1 = __importDefault(require("../log"));
function default_1(dom, HSconfig, data) {
    if (typeof HSconfig.schema === "boolean" && !HSconfig.schema)
        return;
    const is = (0, hexo_is_1.default)(data);
    let schemahtml;
    if (is.home) {
        (0, utils_1.dumpOnce)("data-home.txt", (0, utils_1.extractSimplePageData)(data));
        const homepage = new homepage_1.default({ pretty: __1.isDev, hexo: data });
    }
    else if (is.archive) {
        (0, utils_1.dumpOnce)("data-archive.txt", (0, utils_1.extractSimplePageData)(data));
    }
    else if (is.category) {
        (0, utils_1.dumpOnce)("data-category.txt", (0, utils_1.extractSimplePageData)(data));
    }
    else if (is.tag) {
        (0, utils_1.dumpOnce)("data-tag.txt", (0, utils_1.extractSimplePageData)(data));
    }
    else {
        const Schema = new article_1.default({ pretty: __1.isDev, hexo: data });
        // set url
        let url = data.config.url;
        if (data.page) {
            if (data.page.permalink) {
                url = data.page.permalink;
            }
            else if (data.page.url) {
                url = data.page.url;
            }
        }
        if (url)
            Schema.setUrl(url);
        // sitelinks
        Schema.schema.mainEntityOfPage.potentialAction[0].target.urlTemplate =
            Schema.schema.mainEntityOfPage.potentialAction[0].target.urlTemplate.replace("https://www.webmanajemen.com", data.config.url);
        let keywords = [];
        if (data.config.keywords) {
            keywords = keywords.concat(data.config.keywords.split(",").map(string_1.trimText));
        }
        // set title
        const title = data.page.title || data.title || data.config.title;
        if (title) {
            keywords.push(title);
            Schema.setTitle(title);
        }
        // set schema author
        let author;
        if (data.page) {
            if (data.page["author"]) {
                author = data.page["author"];
            }
        }
        else if (data["author"]) {
            author = data["author"];
        }
        if (author)
            Schema.setAuthor(author);
        // set schema date
        if (data.page) {
            if (data.page.date) {
                Schema.set("dateCreated", data.page.date);
                Schema.set("datePublished", data.page.date);
            }
            if (data.page.modified) {
                Schema.set("dateModified", data.page.modified);
            }
            else if (data.page.updated) {
                Schema.set("dateModified", data.page.updated);
            }
        }
        // set schema body
        let body;
        if (data.page) {
            if (data.page.content) {
                const getText = (0, dom_1.getTextPartialHtml)(data.page.content);
                body = getText;
                if (!body || body.trim().length === 0) {
                    console.log("getText failed");
                    body = data.page.content.replace(/[\W_-]+/gm, " ");
                }
            }
        }
        else if (data.content) {
            body = data.content;
        }
        if (body) {
            body = underscore_1.default.escape(body
                .trim()
                //.replace(/['“"{}\\”]+/gm, "")
                .replace(/https?:\/\//gm, "//"));
            Schema.setArticleBody(body);
            // set schema description
            Schema.setDescription(body.trim().substring(0, 150));
        }
        // set schema description
        /*let description = title;
      if (data.page) {
        if (data.page.description) {
          description = data.page.description;
        } else if (data.page.desc) {
          description = data.page.desc;
        } else if (data.page.subtitle) {
          description = data.page.subtitle;
        } else if (data.page.excerpt) {
          description = data.page.excerpt;
        }
      }
      if (description)
        Schema.setDescription(description.replace(/[\W_-]+/gm, " ").trim());*/
        // prepare breadcrumbs
        const schemaBreadcrumbs = [];
        if (data.page) {
            if (data.page.tags && data.page.tags.length > 0) {
                data.page.tags.forEach((tag) => {
                    keywords.push(tag["name"]);
                    const o = { item: tag["permalink"], name: tag["name"] };
                    schemaBreadcrumbs.push(o);
                });
            }
            if (data.page.categories && data.page.categories.length > 0) {
                data.page.categories.forEach((category) => {
                    keywords.push(category["name"]);
                    const o = { item: category["permalink"], name: category["name"] };
                    schemaBreadcrumbs.push(o);
                });
            }
        }
        if (schemaBreadcrumbs.length > 0) {
            Schema.setBreadcrumbs(schemaBreadcrumbs);
        }
        // set schema image
        let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png";
        if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
            img = data.photos[0];
        }
        else if (data.cover) {
            img = data.cover;
        }
        Schema.setImage(img);
        // set schema genres
        Schema.set("genre", keywords.unique().removeEmpties().map(string_1.trimText).join(","));
        Schema.set("keywords", keywords.unique().removeEmpties().map(string_1.trimText).join(","));
        Schema.set("award", keywords.unique().removeEmpties().map(string_1.trimText).join(","));
        schemahtml = `<script type="application/ld+json">${Schema}</script>`;
        log_1.default.log("schema created", title, url);
    }
    if (schemahtml) {
        const head = dom.getElementsByTagName("head")[0];
        head.insertAdjacentHTML("beforeend", schemahtml);
    }
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4U2NoZW1hLnN0YXRpYy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsic3JjL2h0bWwvZml4U2NoZW1hLnN0YXRpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDRDQUEyQztBQUMzQywrREFBeUU7QUFDekUsMEJBQTJCO0FBQzNCLCtCQUEyQztBQUMzQyx5QkFBdUI7QUFDdkIsNERBQW9DO0FBQ3BDLG9DQUEyRDtBQUUzRCw4REFBcUM7QUFDckMsaUVBQStDO0FBQy9DLGlEQUF5QjtBQUV6QixtQkFBeUIsR0FBZ0IsRUFBRSxRQUFzQixFQUFFLElBQWE7SUFDOUUsSUFBSSxPQUFPLFFBQVEsQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU07UUFBRSxPQUFPO0lBQ3JFLE1BQU0sRUFBRSxHQUFHLElBQUEsaUJBQU0sRUFBQyxJQUFJLENBQUMsQ0FBQztJQUV4QixJQUFJLFVBQWtCLENBQUM7SUFDdkIsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFO1FBQ1gsSUFBQSxnQkFBUSxFQUFDLGVBQWUsRUFBRSxJQUFBLDZCQUFxQixFQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBYyxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNwRTtTQUFNLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRTtRQUNyQixJQUFBLGdCQUFRLEVBQUMsa0JBQWtCLEVBQUUsSUFBQSw2QkFBcUIsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQzNEO1NBQU0sSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ3RCLElBQUEsZ0JBQVEsRUFBQyxtQkFBbUIsRUFBRSxJQUFBLDZCQUFxQixFQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDNUQ7U0FBTSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUU7UUFDakIsSUFB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QyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDdkM7SUFDRCxJQUFJLFVBQVUsRUFBRTtRQUNkLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQ2xEO0FBQ0gsQ0FBQztBQTdKRCw0QkE2SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXR1cm5Db25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyB0cmltVGV4dCB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdcIjtcbmltcG9ydCBzY2hlbWFBcnRpY2xlcywgeyBIZXhvU2VvLCBTY2hlbWFBdXRob3IgfSBmcm9tIFwiLi9zY2hlbWEvYXJ0aWNsZVwiO1xuaW1wb3J0IHsgaXNEZXYgfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IGdldFRleHRQYXJ0aWFsSHRtbCB9IGZyb20gXCIuL2RvbVwiO1xuaW1wb3J0IFwianMtcHJvdG90eXBlc1wiO1xuaW1wb3J0IHVuZGVyc2NvcmUgZnJvbSBcInVuZGVyc2NvcmVcIjtcbmltcG9ydCB7IGR1bXBPbmNlLCBleHRyYWN0U2ltcGxlUGFnZURhdGEgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCB7IEhUTUxFbGVtZW50IH0gZnJvbSBcIm5vZGUtaHRtbC1wYXJzZXJcIjtcbmltcG9ydCBoZXhvSXMgZnJvbSBcIi4uL2hleG8vaGV4by1pc1wiO1xuaW1wb3J0IHNjaGVtYUhvbWVwYWdlIGZyb20gXCIuL3NjaGVtYS9ob21lcGFnZVwiO1xuaW1wb3J0IGxvZyBmcm9tIFwiLi4vbG9nXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChkb206IEhUTUxFbGVtZW50LCBIU2NvbmZpZzogUmV0dXJuQ29uZmlnLCBkYXRhOiBIZXhvU2VvKSB7XG4gIGlmICh0eXBlb2YgSFNjb25maWcuc2NoZW1hID09PSBcImJvb2xlYW5cIiAmJiAhSFNjb25maWcuc2NoZW1hKSByZXR1cm47XG4gIGNvbnN0IGlzID0gaGV4b0lzKGRhdGEpO1xuXG4gIGxldCBzY2hlbWFodG1sOiBzdHJpbmc7XG4gIGlmIChpcy5ob21lKSB7XG4gICAgZHVtcE9uY2UoXCJkYXRhLWhvbWUudHh0XCIsIGV4dHJhY3RTaW1wbGVQYWdlRGF0YShkYXRhKSk7XG4gICAgY29uc3QgaG9tZXBhZ2UgPSBuZXcgc2NoZW1hSG9tZXBhZ2UoeyBwcmV0dHk6IGlzRGV2LCBoZXhvOiBkYXRhIH0pO1xuICB9IGVsc2UgaWYgKGlzLmFyY2hpdmUpIHtcbiAgICBkdW1wT25jZShcImRhdGEtYXJjaGl2ZS50eHRcIiwgZXh0cmFjdFNpbXBsZVBhZ2VEYXRhKGRhdGEpKTtcbiAgfSBlbHNlIGlmIChpcy5jYXRlZ29yeSkge1xuICAgIGR1bXBPbmNlKFwiZGF0YS1jYXRlZ29yeS50eHRcIiwgZXh0cmFjdFNpbXBsZVBhZ2VEYXRhKGRhdGEpKTtcbiAgfSBlbHNlIGlmIChpcy50YWcpIHtcbiAgICBkdW1wT25jZShcImRhdGEtdGFnLnR4dFwiLCBleHRyYWN0U2ltcGxlUGFnZURhdGEoZGF0YSkpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFNjaGVtYSA9IG5ldyBzY2hlbWFBcnRpY2xlcyh7IHByZXR0eTogaXNEZXYsIGhleG86IGRhdGEgfSk7XG4gICAgLy8gc2V0IHVybFxuICAgIGxldCB1cmwgPSBkYXRhLmNvbmZpZy51cmw7XG4gICAgaWYgKGRhdGEucGFnZSkge1xuICAgICAgaWYgKGRhdGEucGFnZS5wZXJtYWxpbmspIHtcbiAgICAgICAgdXJsID0gZGF0YS5wYWdlLnBlcm1hbGluaztcbiAgICAgIH0gZWxzZSBpZiAoZGF0YS5wYWdlLnVybCkge1xuICAgICAgICB1cmwgPSBkYXRhLnBhZ2UudXJsO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodXJsKSBTY2hlbWEuc2V0VXJsKHVybCk7XG5cbiAgICAvLyBzaXRlbGlua3NcbiAgICBTY2hlbWEuc2NoZW1hLm1haW5FbnRpdHlPZlBhZ2UucG90ZW50aWFsQWN0aW9uWzBdLnRhcmdldC51cmxUZW1wbGF0ZSA9XG4gICAgICBTY2hlbWEuc2NoZW1hLm1haW5FbnRpdHlPZlBhZ2UucG90ZW50aWFsQWN0aW9uWzBdLnRhcmdldC51cmxUZW1wbGF0ZS5yZXBsYWNlKFxuICAgICAgICBcImh0dHBzOi8vd3d3LndlYm1hbmFqZW1lbi5jb21cIixcbiAgICAgICAgZGF0YS5jb25maWcudXJsXG4gICAgICApO1xuXG4gICAgbGV0IGtleXdvcmRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmIChkYXRhLmNvbmZpZy5rZXl3b3Jkcykge1xuICAgICAga2V5d29yZHMgPSBrZXl3b3Jkcy5jb25jYXQoZGF0YS5jb25maWcua2V5d29yZHMuc3BsaXQoXCIsXCIpLm1hcCh0cmltVGV4dCkpO1xuICAgIH1cblxuICAgIC8vIHNldCB0aXRsZVxuICAgIGNvbnN0IHRpdGxlID0gZGF0YS5wYWdlLnRpdGxlIHx8IGRhdGEudGl0bGUgfHwgZGF0YS5jb25maWcudGl0bGU7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICBrZXl3b3Jkcy5wdXNoKHRpdGxlKTtcbiAgICAgIFNjaGVtYS5zZXRUaXRsZSh0aXRsZSk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHNjaGVtYSBhdXRob3JcbiAgICBsZXQgYXV0aG9yOiBTY2hlbWFBdXRob3I7XG4gICAgaWYgKGRhdGEucGFnZSkge1xuICAgICAgaWYgKGRhdGEucGFnZVtcImF1dGhvclwiXSkge1xuICAgICAgICBhdXRob3IgPSBkYXRhLnBhZ2VbXCJhdXRob3JcIl07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRhW1wiYXV0aG9yXCJdKSB7XG4gICAgICBhdXRob3IgPSBkYXRhW1wiYXV0aG9yXCJdO1xuICAgIH1cbiAgICBpZiAoYXV0aG9yKSBTY2hlbWEuc2V0QXV0aG9yKGF1dGhvcik7XG5cbiAgICAvLyBzZXQgc2NoZW1hIGRhdGVcbiAgICBpZiAoZGF0YS5wYWdlKSB7XG4gICAgICBpZiAoZGF0YS5wYWdlLmRhdGUpIHtcbiAgICAgICAgU2NoZW1hLnNldChcImRhdGVDcmVhdGVkXCIsIGRhdGEucGFnZS5kYXRlKTtcbiAgICAgICAgU2NoZW1hLnNldChcImRhdGVQdWJsaXNoZWRcIiwgZGF0YS5wYWdlLmRhdGUpO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEucGFnZS5tb2RpZmllZCkge1xuICAgICAgICBTY2hlbWEuc2V0KFwiZGF0ZU1vZGlmaWVkXCIsIGRhdGEucGFnZS5tb2RpZmllZCk7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEucGFnZS51cGRhdGVkKSB7XG4gICAgICAgIFNjaGVtYS5zZXQoXCJkYXRlTW9kaWZpZWRcIiwgZGF0YS5wYWdlLnVwZGF0ZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNldCBzY2hlbWEgYm9keVxuICAgIGxldCBib2R5OiBzdHJpbmc7XG4gICAgaWYgKGRhdGEucGFnZSkge1xuICAgICAgaWYgKGRhdGEucGFnZS5jb250ZW50KSB7XG4gICAgICAgIGNvbnN0IGdldFRleHQgPSBnZXRUZXh0UGFydGlhbEh0bWwoZGF0YS5wYWdlLmNvbnRlbnQpO1xuICAgICAgICBib2R5ID0gZ2V0VGV4dDtcbiAgICAgICAgaWYgKCFib2R5IHx8IGJvZHkudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0VGV4dCBmYWlsZWRcIik7XG4gICAgICAgICAgYm9keSA9IGRhdGEucGFnZS5jb250ZW50LnJlcGxhY2UoL1tcXFdfLV0rL2dtLCBcIiBcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGEuY29udGVudCkge1xuICAgICAgYm9keSA9IGRhdGEuY29udGVudDtcbiAgICB9XG4gICAgaWYgKGJvZHkpIHtcbiAgICAgIGJvZHkgPSB1bmRlcnNjb3JlLmVzY2FwZShcbiAgICAgICAgYm9keVxuICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAvLy5yZXBsYWNlKC9bJ+KAnFwie31cXFxc4oCdXSsvZ20sIFwiXCIpXG4gICAgICAgICAgLnJlcGxhY2UoL2h0dHBzPzpcXC9cXC8vZ20sIFwiLy9cIilcbiAgICAgICk7XG4gICAgICBTY2hlbWEuc2V0QXJ0aWNsZUJvZHkoYm9keSk7XG4gICAgICAvLyBzZXQgc2NoZW1hIGRlc2NyaXB0aW9uXG4gICAgICBTY2hlbWEuc2V0RGVzY3JpcHRpb24oYm9keS50cmltKCkuc3Vic3RyaW5nKDAsIDE1MCkpO1xuICAgIH1cblxuICAgIC8vIHNldCBzY2hlbWEgZGVzY3JpcHRpb25cbiAgICAvKmxldCBkZXNjcmlwdGlvbiA9IHRpdGxlO1xuICBpZiAoZGF0YS5wYWdlKSB7XG4gICAgaWYgKGRhdGEucGFnZS5kZXNjcmlwdGlvbikge1xuICAgICAgZGVzY3JpcHRpb24gPSBkYXRhLnBhZ2UuZGVzY3JpcHRpb247XG4gICAgfSBlbHNlIGlmIChkYXRhLnBhZ2UuZGVzYykge1xuICAgICAgZGVzY3JpcHRpb24gPSBkYXRhLnBhZ2UuZGVzYztcbiAgICB9IGVsc2UgaWYgKGRhdGEucGFnZS5zdWJ0aXRsZSkge1xuICAgICAgZGVzY3JpcHRpb24gPSBkYXRhLnBhZ2Uuc3VidGl0bGU7XG4gICAgfSBlbHNlIGlmIChkYXRhLnBhZ2UuZXhjZXJwdCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBkYXRhLnBhZ2UuZXhjZXJwdDtcbiAgICB9XG4gIH1cbiAgaWYgKGRlc2NyaXB0aW9uKVxuICAgIFNjaGVtYS5zZXREZXNjcmlwdGlvbihkZXNjcmlwdGlvbi5yZXBsYWNlKC9bXFxXXy1dKy9nbSwgXCIgXCIpLnRyaW0oKSk7Ki9cblxuICAgIC8vIHByZXBhcmUgYnJlYWRjcnVtYnNcbiAgICBjb25zdCBzY2hlbWFCcmVhZGNydW1icyA9IFtdO1xuICAgIGlmIChkYXRhLnBhZ2UpIHtcbiAgICAgIGlmIChkYXRhLnBhZ2UudGFncyAmJiBkYXRhLnBhZ2UudGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRhdGEucGFnZS50YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICAgIGtleXdvcmRzLnB1c2godGFnW1wibmFtZVwiXSk7XG4gICAgICAgICAgY29uc3QgbyA9IHsgaXRlbTogdGFnW1wicGVybWFsaW5rXCJdLCBuYW1lOiB0YWdbXCJuYW1lXCJdIH07XG4gICAgICAgICAgc2NoZW1hQnJlYWRjcnVtYnMucHVzaCg8YW55Pm8pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEucGFnZS5jYXRlZ29yaWVzICYmIGRhdGEucGFnZS5jYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGF0YS5wYWdlLmNhdGVnb3JpZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcbiAgICAgICAgICBrZXl3b3Jkcy5wdXNoKGNhdGVnb3J5W1wibmFtZVwiXSk7XG4gICAgICAgICAgY29uc3QgbyA9IHsgaXRlbTogY2F0ZWdvcnlbXCJwZXJtYWxpbmtcIl0sIG5hbWU6IGNhdGVnb3J5W1wibmFtZVwiXSB9O1xuICAgICAgICAgIHNjaGVtYUJyZWFkY3J1bWJzLnB1c2goPGFueT5vKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzY2hlbWFCcmVhZGNydW1icy5sZW5ndGggPiAwKSB7XG4gICAgICBTY2hlbWEuc2V0QnJlYWRjcnVtYnMoc2NoZW1hQnJlYWRjcnVtYnMpO1xuICAgIH1cblxuICAgIC8vIHNldCBzY2hlbWEgaW1hZ2VcbiAgICBsZXQgaW1nID1cbiAgICAgIFwiaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy90aHVtYi9hL2FjL05vX2ltYWdlX2F2YWlsYWJsZS5zdmcvMTIwMHB4LU5vX2ltYWdlX2F2YWlsYWJsZS5zdmcucG5nXCI7XG4gICAgaWYgKGRhdGEucGhvdG9zICYmIEFycmF5LmlzQXJyYXkoZGF0YS5waG90b3MpICYmIGRhdGEucGhvdG9zLmxlbmd0aCA+IDApIHtcbiAgICAgIGltZyA9IGRhdGEucGhvdG9zWzBdO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5jb3Zlcikge1xuICAgICAgaW1nID0gZGF0YS5jb3ZlcjtcbiAgICB9XG4gICAgU2NoZW1hLnNldEltYWdlKGltZyk7XG5cbiAgICAvLyBzZXQgc2NoZW1hIGdlbnJlc1xuICAgIFNjaGVtYS5zZXQoXCJnZW5yZVwiLCBrZXl3b3Jkcy51bmlxdWUoKS5yZW1vdmVFbXB0aWVzKCkubWFwKHRyaW1UZXh0KS5qb2luKFwiLFwiKSk7XG4gICAgU2NoZW1hLnNldChcImtleXdvcmRzXCIsIGtleXdvcmRzLnVuaXF1ZSgpLnJlbW92ZUVtcHRpZXMoKS5tYXAodHJpbVRleHQpLmpvaW4oXCIsXCIpKTtcbiAgICBTY2hlbWEuc2V0KFwiYXdhcmRcIiwga2V5d29yZHMudW5pcXVlKCkucmVtb3ZlRW1wdGllcygpLm1hcCh0cmltVGV4dCkuam9pbihcIixcIikpO1xuXG4gICAgc2NoZW1haHRtbCA9IGA8c2NyaXB0IHR5cGU9XCJhcHBsaWNhdGlvbi9sZCtqc29uXCI+JHtTY2hlbWF9PC9zY3JpcHQ+YDtcbiAgICBsb2cubG9nKFwic2NoZW1hIGNyZWF0ZWRcIiwgdGl0bGUsIHVybCk7XG4gIH1cbiAgaWYgKHNjaGVtYWh0bWwpIHtcbiAgICBjb25zdCBoZWFkID0gZG9tLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcbiAgICBoZWFkLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBzY2hlbWFodG1sKTtcbiAgfVxufVxuIl19