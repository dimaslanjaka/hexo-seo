import log from "hexo-log";

interface Consoler extends Console {
  olog: (...any) => void;
  prepend: (value: string) => any;
}

const logger: Consoler = <any>log({
  debug: false,
  silent: false
});
logger.olog = logger.log;
logger.prepend = function (text: string) {
  logger.log = function (...anyx) {
    logger.olog(text, anyx);
  };
};

export default logger;
