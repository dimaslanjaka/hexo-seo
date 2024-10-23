import * as hexoLog from 'hexo-log';

const logger: Console = hexoLog.logger({
  debug: false,
  silent: false
}) as any;

export default logger;
