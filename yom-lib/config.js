/** 默认清理多久前的日志，单位：小时 */
const DEFAULT_LOG_RORATE = 3;
export const LogLevel = {
  /** console.debug */
  Debug: '4',
  /** cosnole.log and console.info */
  Info: '3',
  /** console.warn */
  Warnings: '2',
  /** console.error */
  Errors: '1',
  /** no logs */
  None: '-1',
}

export const config = {
  logLevel: LogLevel.Debug,
  logRorate: DEFAULT_LOG_RORATE,
  networkEnable: true
}

export function setConfigLogLevel(logLevel) {
  if (+logLevel === NaN || +logLevel < 0 || +logLevel > 4)
    throw new Error('Invalid log level');;
  config.logLevel = logLevel;
  localStorage.setItem('yom-log-level', logLevel);
  return true;
}

export function setConfigLogRorate(logRorate) {
  config.logRorate = logRorate;
  localStorage.setItem('yom-log-rotate', logRorate);
  return true;
}

export function setNetworkEnable(isEnable) {
  config.networkEnable = isEnable;
  localStorage.setItem('yom-network-enable', isEnable);
  return true;
}

function initConfig() {
  config.logLevel = localStorage.getItem('yom-log-level') || LogLevel.Debug;
  config.logRorate = localStorage.getItem('yom-log-rotate') || DEFAULT_LOG_RORATE;
  config.networkEnable = localStorage.getItem('yom-network-enable') || '1';
  console.log('yom initConfig logLevel', config.logLevel)
  console.log('yom initConfig logRorate', config.logRorate)
  console.log('yom initConfig networkEnable', config.networkEnable)
}

initConfig();