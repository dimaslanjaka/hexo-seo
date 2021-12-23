"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
function getCategoryTags(hexo) {
    var groups = ["categories", "tags"];
    var locals = hexo.locals;
    var groupfilter = {
        tags: [],
        categories: []
    };
    if (!locals) {
        return groupfilter;
    }
    groups.map(function (group) {
        var lastModifiedObject = locals.get(group).map(function (items) {
            if (items.posts) {
                var archives = items;
                var posts = archives.posts;
                var latest = getLatestFromArrayDates(posts.map(function (post) {
                    return post.updated.toDate();
                }));
                var permalink = new URL(hexo.config.url);
                permalink.pathname = archives.path;
                return {
                    permalink: permalink.toString(),
                    name: archives.name,
                    latest: (0, moment_1.default)(latest).format("YYYY-MM-DDTHH:mm:ssZ")
                };
            }
        });
        groupfilter[group] = lastModifiedObject;
    });
    return groupfilter;
}
function getLatestFromArrayDates(arr) {
    return new Date(Math.max.apply(null, arr.map(function (e) {
        return e;
    })));
}
exports.default = getCategoryTags;
