"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const cache = new persistentCache({ name: 'authors', persist: true });
/**
 * get post author from post object
 * @param postObj post object like { title: '', permalink: '' }
 * @param hexoConfig hexo.config object
 * @returns author name
 */
function getAuthor(postObj, hexoConfig) {
    if (hexoConfig === void 0) { hexoConfig = {}; }
    if (postObj) {
        // validate post object not null or undefined
        var author = typeof postObj == 'string' ? postObj : postObj.author || hexoConfig.author;
        // validate author is not null or undefined
        if (author) {
            if (typeof author == 'string')
                return author;
            if ('nick' in author)
                return author.nick;
            if ('name' in author)
                return author.name;
            if ('nickname' in author)
                return author.nickname;
        }
    }
    // return unknown author
    return 'Unknown Author';
}
exports.default = getAuthor;
