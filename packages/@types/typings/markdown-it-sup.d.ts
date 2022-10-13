declare module 'markdown-it-sup' {
  import MarkdownIt from 'markdown-it';
  import Ruler from 'markdown-it/lib/ruler';
  var UNESCAPE_RE: RegExp;
  function superscript(state: Ruler.RuleOptions, silent: boolean): boolean;
  export default function plugin_sup(md: MarkdownIt): void;
}
