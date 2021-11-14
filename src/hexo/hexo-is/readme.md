# Determine hexo instance

> Where is you now ? page ? archive ? whatever

# Usage

```js
const is = require('hexo-is');
function where(){
  console.log(is(this));
}
hexo.extend.filter.register("after_render:js", where);
hexo.extend.filter.register("after_render:css", where);
hexo.extend.filter.register("after_render:html", where);
```