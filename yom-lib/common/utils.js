import { configParams } from '../config.js'

/**
 * get absolute path
 * @param {String} url
 */
export function getAbsoultPath(url) {
  if (!url || typeof url !== 'string') return '';
  // 兼容 worker 场景
  if(isSelf()) return getAbsolutePathInWorker(url);
  const a = document.createElement('a');
  a.href = url;
  return a.href;
}
function getAbsolutePathInWorker(url) {
  try {
    const urlObj = new URL(url, configParams.workerBaseUrl);
    return urlObj.href;
  } catch (e) {
    console.error('Error parsing URL:', e);
    return url;
  }
}

export function key2UpperCase(key) {
  return key.replace(/^\S|-[a-z]/g, s => s.toUpperCase());
}

export function isMatches(element, selector) {
  // When some selectors in the safair kernel cannot be parsed, calling the matches method will throw an exception, which is captured here
  try {
    if (element.matches) {
      return element.matches((selector));
    }
    // deprecated
    if (element.webkitMatchesSelector) {
      return element.webkitMatchesSelector(selector);
    }
    if (element.mozMatchesSelector) {
      return element.mozMatchesSelector(selector);
    }
  } catch {
    return false;
  }
}

export function isMobile() {
  return /ios|iphone|ipod|android/.test(navigator.userAgent.toLowerCase());
}

export function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
/** 只保留字符串中的字母和数字 */
export function makeString2NumberChar(input) {
  return input?.replace(/[^a-zA-Z0-9]/g, '');
}

export function callsites() {
  const _prepareStackTrace = Error.prepareStackTrace;
  try {
    let result = [];
    Error.prepareStackTrace = (_, callSites) => {
      const callSitesWithoutCurrent = callSites.slice(1);
      result = callSitesWithoutCurrent;
      return callSitesWithoutCurrent;
    };

    new Error().stack; // eslint-disable-line unicorn/error-message, no-unused-expressions
    return result;
  } finally {
    Error.prepareStackTrace = _prepareStackTrace;
  }
}

export function isSelf() {
  try {
    if (self.length === 0) return false;
    else return true;
    // // eslint-disable-next-line no-unused-expressions
    // window
    // return false
  } catch (err) {
    return true
  }
}

export function localStorageGetItem(key) {
  if (isSelf()) return;
  return localStorage.getItem(key) || '';
}

export function localStorageSetItem(key, value) {
  if (isSelf()) return;
  return localStorage.setItem(key, value);
}