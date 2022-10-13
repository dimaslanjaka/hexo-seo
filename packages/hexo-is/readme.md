# Determine hexo instance

> Where is you now ? page ? archive ? whatever

this plugin can be used to determine where you are from plugin hexo

# Usage

```js
const is = require('hexo-is');
function where(content, data){
  console.log(is(data));
}
hexo.extend.filter.register("after_render:js", where);
hexo.extend.filter.register("after_render:css", where);
hexo.extend.filter.register("after_render:html", where);
```