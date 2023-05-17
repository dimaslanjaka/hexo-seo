import log from 'hexo-log';

const logger: Console = log({
  debug: false,
  silent: false
}) as any;

export default logger;
