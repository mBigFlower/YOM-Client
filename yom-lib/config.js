import { localStorageGetItem, localStorageSetItem } from './common/utils'
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
  yomNetworkEnable: '1',
  yomConsoleEnable: '1',
  chromeConsoleEnable: '1',
}

export function setConfig(_config) {
  if (_config.logLevel !== undefined) {
    if (+_config.logLevel === NaN || +_config.logLevel < 0 || +_config.logLevel > 4)
      return console.error('Invalid log level');;
    config.logLevel = _config.logLevel;
    localStorageSetItem('yom-log-level', config.logLevel);
  }
  if (_config.logRorate !== undefined) {
    config.logRorate = _config.logRorate;
    localStorageSetItem('yom-log-rotate', config.logRorate);
  }
  if (_config.yomNetworkEnable !== undefined) {
    config.yomNetworkEnable = _config.yomNetworkEnable;
    localStorageSetItem('yom-network-enable', config.yomNetworkEnable);
  }
  if (_config.yomConsoleEnable !== undefined) {
    config.yomConsoleEnable = _config.yomConsoleEnable
    localStorageSetItem('yom-console-enable', config.yomConsoleEnable);
  };
  if (_config.chromeConsoleEnable !== undefined) {
    config.chromeConsoleEnable = _config.chromeConsoleEnable;
    localStorageSetItem('chrome-console-enable', config.chromeConsoleEnable);
  }
  return config;
}

export function setConfigLogLevel(logLevel) {
  if (+logLevel === NaN || +logLevel < 0 || +logLevel > 4)
    throw new Error('Invalid log level');;
  config.logLevel = logLevel;
  localStorageSetItem('yom-log-level', logLevel);
  return true;
}

export function setConfigLogRorate(logRorate) {
  config.logRorate = logRorate;
  localStorageSetItem('yom-log-rotate', logRorate);
  return true;
}

export function setYomNetworkEnable(isEnable) {
  config.yomNetworkEnable = isEnable;
  localStorageSetItem('yom-network-enable', isEnable);
  return true;
}
export function setYomConsoleEnable(isEnable) {
  config.yomConsoleEnable = isEnable;
  localStorageSetItem('yom-console-enable', isEnable);
  return true;
}
export function setChromeConsoleEnable(isEnable) {
  config.chromeConsoleEnable = isEnable;
  localStorageSetItem('chrome-console-enable', isEnable);
  return true;
}

function initConfig() {
  config.logLevel = localStorageGetItem('yom-log-level') || LogLevel.Debug;
  config.logRorate = localStorageGetItem('yom-log-rotate') || DEFAULT_LOG_RORATE;
  config.yomNetworkEnable = localStorageGetItem('yom-network-enable') || '1';
  config.yomConsoleEnable = localStorageGetItem('yom-console-enable') || '1';
  config.chromeConsoleEnable = localStorageGetItem('chrome-console-enable') || '1';
  console.log('yom initConfig logLevel', config.logLevel)
  console.log('yom initConfig logRorate', config.logRorate, 'h')
  console.log('yom initConfig yomNetworkEnable', config.yomNetworkEnable)
  console.log('yom initConfig yomConsoleEnable', config.yomConsoleEnable)
  console.log('yom initConfig chromeConsoleEnable', config.chromeConsoleEnable)
}

initConfig();