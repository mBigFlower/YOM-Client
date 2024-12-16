import { localStorageGetItem, localStorageSetItem } from './common/utils'
import { openNewDatabase } from './datacenter';
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

export const configParams = {
  logLevel: LogLevel.Debug,
  logRorate: DEFAULT_LOG_RORATE,
  yomNetworkEnable: '1',
  yomConsoleEnable: '1',
  chromeConsoleEnable: '1',
  workerBaseUrl: '',
  dbName: '',
}

export function setConfig(_config) {
  if (_config.logLevel !== undefined) {
    if (+_config.logLevel === NaN || +_config.logLevel < 0 || +_config.logLevel > 4)
      return console.error('Invalid log level');;
    configParams.logLevel = _config.logLevel;
    localStorageSetItem('yom-log-level', configParams.logLevel);
  }
  if (_config.logRorate !== undefined) {
    configParams.logRorate = _config.logRorate;
    localStorageSetItem('yom-log-rotate', configParams.logRorate);
  }
  if (_config.yomNetworkEnable !== undefined) {
    configParams.yomNetworkEnable = _config.yomNetworkEnable;
    localStorageSetItem('yom-network-enable', configParams.yomNetworkEnable);
  }
  if (_config.yomConsoleEnable !== undefined) {
    configParams.yomConsoleEnable = _config.yomConsoleEnable
    localStorageSetItem('yom-console-enable', configParams.yomConsoleEnable);
  };
  if (_config.chromeConsoleEnable !== undefined) {
    configParams.chromeConsoleEnable = _config.chromeConsoleEnable;
    localStorageSetItem('chrome-console-enable', configParams.chromeConsoleEnable);
  }
  if (_config.workerBaseUrl !== undefined) {
    configParams.workerBaseUrl = _config.workerBaseUrl;
    localStorageSetItem('worker-base-url', configParams.workerBaseUrl);
  }
  if (_config.dbName !== undefined) {
    configParams.dbName = _config.dbName;
    openNewDatabase(_config.dbName);
    localStorageSetItem('db-name', configParams.dbName);
  }
  return configParams;
}

export function setConfigLogLevel(logLevel) {
  if (+logLevel === NaN || +logLevel < 0 || +logLevel > 4)
    throw new Error('Invalid log level');;
  configParams.logLevel = logLevel;
  localStorageSetItem('yom-log-level', logLevel);
  return true;
}

export function setConfigLogRorate(logRorate) {
  configParams.logRorate = logRorate;
  localStorageSetItem('yom-log-rotate', logRorate);
  return true;
}

export function setYomNetworkEnable(isEnable) {
  configParams.yomNetworkEnable = isEnable;
  localStorageSetItem('yom-network-enable', isEnable);
  return true;
}
export function setYomConsoleEnable(isEnable) {
  configParams.yomConsoleEnable = isEnable;
  localStorageSetItem('yom-console-enable', isEnable);
  return true;
}
export function setChromeConsoleEnable(isEnable) {
  configParams.chromeConsoleEnable = isEnable;
  localStorageSetItem('chrome-console-enable', isEnable);
  return true;
}

function initConfig() {
  configParams.logLevel = localStorageGetItem('yom-log-level') || LogLevel.Debug;
  configParams.logRorate = localStorageGetItem('yom-log-rotate') || DEFAULT_LOG_RORATE;
  configParams.yomNetworkEnable = localStorageGetItem('yom-network-enable') || '1';
  configParams.yomConsoleEnable = localStorageGetItem('yom-console-enable') || '1';
  configParams.chromeConsoleEnable = localStorageGetItem('chrome-console-enable') || '1';
  configParams.workerBaseUrl = localStorageGetItem('worker-base-url') || '';
  console.table('yom initConfig', configParams)
}

initConfig();