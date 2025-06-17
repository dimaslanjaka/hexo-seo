import Hexo from 'hexo';
import { isValidHttpUrl } from 'sbg-utility';
import { isValidEmail } from './string';

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
  let result = '';
  // return site url
  if (postObj) {
    // validate post object not null or undefined
    const author: string | Record<string, any> =
      typeof postObj == 'string' ? postObj : postObj.author || hexoConfig.author;
    // validate author is not null or undefined
    if (author) {
      if (typeof author == 'string') {
        result = author;
      } else if ('link' in author) {
        result = author.link;
      }
    }
  }
  if (isValidHttpUrl(result)) return result;
  return hexoConfig.url;
}

/**
 * Retrieves the author's email from a post object or hexo configuration.
 *
 * @param postObj - The post object which may contain the author's information.
 * This can be either a string representing the author's email or an object containing author details.
 *
 * @param hexoConfig - The Hexo configuration object, which may contain default author information.
 * Defaults to an empty object if not provided.
 *
 * @returns The author's email address if valid; otherwise, returns a default email address ('noreply@blogger.com').
 *
 * @example
 * ```typescript
 * const post = { author: { email: "author@example.com" } };
 * const email = getAuthorEmail(post);
 * console.log(email); // Outputs: "author@example.com"
 * ```
 *
 * @example
 * ```typescript
 * const email = getAuthorEmail("author@example.com");
 * console.log(email); // Outputs: "author@example.com"
 * ```
 *
 * @example
 * ```typescript
 * const invalidPost = {};
 * const email = getAuthorEmail(invalidPost);
 * console.log(email); // Outputs: "noreply@blogger.com"
 * ```
 */
export function getAuthorEmail(postObj: Record<string, any> | string, hexoConfig: Hexo['config'] = {} as any): string {
  let result = 'noreply@blogger.com';

  // Check if postObj is provided
  if (postObj) {
    // Determine the author from the post object or hexo config
    const author: string | Record<string, any> =
      typeof postObj === 'string' ? postObj : postObj.author || hexoConfig.author;

    // Validate author is not null or undefined
    if (author) {
      if (typeof author === 'string') {
        result = author; // Use the string author directly
      } else {
        if ('email' in author) {
          result = author.email;
        } else if ('mail' in author) {
          result = author.mail;
        } else if (hexoConfig.email) {
          // get _config_yml.email
          result = hexoConfig.email;
        }
      }
    }
  }

  // Validate the email address
  if (!isValidEmail(result)) return 'noreply@blogger.com';

  return result; // Return the valid email address
}

export default function getAuthor(postObj: Record<string, any> | string, hexoConfig: Hexo['config'] = {} as any) {
  return {
    name: getAuthorName(postObj, hexoConfig),
    link: getAuthorLink(postObj, hexoConfig)
  };
}
