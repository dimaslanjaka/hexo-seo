import Hexo from 'hexo';

// const cache = new persistentCache({ name: 'authors', persist: true });

/**
 * get post author from post object
 * @param postObj post object like { title: '', permalink: '' } or author object
 * @param hexoConfig hexo.config object
 * @returns author name
 */
export function getAuthorName(postObj: Record<string, any> | string, hexoConfig: Hexo['config'] = {} as any): string {
  if (postObj) {
    // validate post object not null or undefined
    const author: string | Record<string, any> =
      typeof postObj == 'string' ? postObj : postObj.author || hexoConfig.author;
    // validate author is not null or undefined
    if (author) {
      if (typeof author == 'string') return author;
      if ('nick' in author) return author.nick;
      if ('name' in author) return author.name;
      if ('nickname' in author) return author.nickname;
    }
  }
  // return unknown author
  return 'Unknown Author';
}

export function getAuthorLink(postObj: Record<string, any> | string, hexoConfig: Hexo['config'] = {} as any) {
  // return site url
  if (postObj) {
    // validate post object not null or undefined
    const author: string | Record<string, any> =
      typeof postObj == 'string' ? postObj : postObj.author || hexoConfig.author;
    // validate author is not null or undefined
    if (author) {
      if (typeof author == 'string') return author;
      if ('link' in author) return author.link;
    }
  }
  return hexoConfig.url;
}

export default function getAuthor(postObj: Record<string, any> | string, hexoConfig: Hexo['config'] = {} as any) {
  return {
    name: getAuthorName(postObj, hexoConfig),
    link: getAuthorLink(postObj, hexoConfig)
  };
}
