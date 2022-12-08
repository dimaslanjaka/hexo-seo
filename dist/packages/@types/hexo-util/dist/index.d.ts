declare module 'hexo-util' {
  export const Cache: {
    new (): import('./cache');
  };
  export const CacheStream: typeof import('./cache_stream');
  export const camelCaseKeys: typeof import('./camel_case_keys');
  export const Color: typeof import('./color');
  export const decodeURL: (str: any) => any;
  export const deepMerge: typeof import('./deep_merge');
  export const encodeURL: (str: any) => any;
  export const escapeDiacritic: typeof import('./escape_diacritic');
  export const escapeHTML: typeof import('./escape_html');
  export const escapeRegExp: typeof import('./escape_regexp');
  export const full_url_for: typeof import('./full_url_for');
  export const gravatar: typeof import('./gravatar');
  export const highlight: typeof import('./highlight');
  export const htmlTag: typeof import('./html_tag');
  export const isExternalLink: typeof import('./is_external_link');
  export const Pattern: typeof import('./pattern');
  export const Permalink: typeof import('./permalink');
  export const prettyUrls: typeof import('./pretty_urls');
  export const prismHighlight: typeof import('./prism');
  export const relative_url: typeof import('./relative_url');
  export const slugize: typeof import('./slugize');
  export const spawn: typeof import('./spawn');
  export const stripHTML: typeof import('./strip_html');
  export const stripIndent: typeof import('strip-indent');
  export const tocObj: typeof import('./toc_obj');
  export const truncate: typeof import('./truncate');
  export const unescapeHTML: (str: any) => string;
  export const url_for: typeof import('./url_for');
  export const wordWrap: typeof import('./word_wrap');
  export const hash: typeof import('./hash').hash
  export const createSha1Hash: typeof import('./hash').createSha1Hash
  //# sourceMappingURL=index.d.ts.map
}

