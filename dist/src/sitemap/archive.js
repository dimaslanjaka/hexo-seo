"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestFromArrayDates = getLatestFromArrayDates;
const moment_1 = __importDefault(require("moment"));
function getCategoryTags(hexo) {
    const groups = ['categories', 'tags'];
    const locals = hexo.locals;
    const groupfilter = {
        tags: [],
        categories: []
    };
    if (!locals) {
        return groupfilter;
    }
    groups.map((group) => {
        const lastModifiedObject = locals.get(group).map((items) => {
            if (items.posts) {
                const archives = items;
                const posts = archives.posts;
                const latest = getLatestFromArrayDates(posts.map((post) => {
                    return post.updated.toDate();
                }));
                const permalink = new URL(hexo.config.url);
                permalink.pathname = archives.path;
                return {
                    permalink: permalink.toString(),
                    name: archives.name,
                    latest: (0, moment_1.default)(latest).format('YYYY-MM-DDTHH:mm:ssZ')
                };
            }
        });
        groupfilter[group] = lastModifiedObject;
    });
    return groupfilter;
}
/**
 * get latest date from array of date
 * @param arr
 * @returns
 */
function getLatestFromArrayDates(arr) {
    return new Date(Math.max.apply(null, arr.map(function (e) {
        return e instanceof Date ? e : (0, moment_1.default)(e).toDate();
    })));
}
exports.default = getCategoryTags;
