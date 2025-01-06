import { localStorageGetItem, localStorageSetItem } from './common/utils'
import { openNewDatabase } from './datacenter';
import { initNetworkFilter } from './filter';
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
  /** 
   * 为了避免network输出过多，此处通过 filter 进行精简
   * {url: '', filter: ''}
   * 0：与此url相关的请求和响应都不保存
   * 1：过滤请求body
   * 2：过滤响应body
   * 3：同时过滤请求和响应的body
   */
  networkFilter: [],
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
  if (_config.networkFilter !== undefined) {
    configParams.networkFilter = _config.networkFilter;
    initNetworkFilter(_config.networkFilter);
  }
  return configParams;
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