declare module 'markdown-it-sub' {
  import MarkdownIt from 'markdown-it';
  import Ruler from 'markdown-it/lib/ruler';
  var UNESCAPE_RE: RegExp;
  function subscript(state: Ruler.RuleOptions, silent: boolean): boolean;
  export default function sub_plugin(md: MarkdownIt): void;
}
