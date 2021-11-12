import log from "hexo-log";
import { Console } from "inspector";

const logger: Console = <any>log({
  debug: false,
  silent: false
});

export default logger;
