"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorName = getAuthorName;
exports.getAuthorLink = getAuthorLink;
exports.default = getAuthor;
// const cache = new persistentCache({ name: 'authors', persist: true });
/**
 * get post author from post object
 * @param postObj post object like { title: '', permalink: '' } or author object
 * @param hexoConfig hexo.config object
 * @returns author name
 */
function getAuthorName(postObj, hexoConfig = {}) {
    if (postObj) {
        // validate post object not null or undefined
        const author = typeof postObj == 'string' ? postObj : postObj.author || hexoConfig.author;
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
function getAuthorLink(postObj, hexoConfig = {}) {
    // return site url
    if (postObj) {
        // validate post object not null or undefined
        const author = typeof postObj == 'string' ? postObj : postObj.author || hexoConfig.author;
        // validate author is not null or undefined
        if (author) {
            if (typeof author == 'string')
                return author;
            if ('link' in author)
                return author.link;
        }
    }
    return hexoConfig.url;
}
function getAuthor(postObj, hexoConfig = {}) {
    return {
        name: getAuthorName(postObj, hexoConfig),
        link: getAuthorLink(postObj, hexoConfig)
    };
}
