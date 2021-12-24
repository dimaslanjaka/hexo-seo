# js-prototypes

instalation

```shell
npm i git+https://github.com/dimaslanjaka/js-prototypes.git
```

usage

```ts
// global automated shim to all prototypes (recommended)
import "js-prototypes"

// or via node typescript
import "js-prototypes/src/String";
import "js-prototypes/src/globals";

// or via node javascript
import "js-prototypes/dist/libs/globals";

//// BROWSER
// or
import "js-prototypes/dist/release/bundle.js"
// or
import "js-prototypes";
```
