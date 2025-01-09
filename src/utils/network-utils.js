import { formatDuration } from './date-utils';

//#region 网络数据解析
export function analyzeNetworkData(networks) {
  console.log('analyzeNetworkData', networks);
  const networkMap = new Map();
  if (!networks) return;
  networks.forEach(item => {
    const { data } = item;
    if (!data) return;
    const { method, params } = data;
    if (!params) return;
    const network = networkMap.get(params.requestId) || [];
    params.method = method;
    network.push(params);
    networkMap.set(params.requestId, network);
  })
  console.log('networkMap', networkMap);
  const result = [];
  networkMap.forEach((value, key) => {
    console.log('networkMap', key, value);
    result.push({
      key,
      basicInfo: getBasicInfo(value),
      requestHeaders: getRequestHeaders(value),
      requestParams: getRequestParams(value),
      responseHeaders: getResponseHeaders(value),
      responseBody: getResponseBody(value),
    });
  })
  console.log('networkMap result', result);
  return result;
}
/**
 *
  requestWillBeSent: 'Network.requestWillBeSent',
  responseReceivedExtraInfo: 'Network.responseReceivedExtraInfo',
  responseReceived: 'Network.responseReceived',
  loadingFinished: 'Network.loadingFinished',
  responseBody: 'Network.responseBody',
 * @param {*} data
 */
function getBasicInfo(data) {
  // TODO 异常检测
  const basicInfo = {}
  if (!data?.length) return {}
  basicInfo.requestUrl = data[0]?.request?.url;
  basicInfo.requestPathName = new URL(data[0]?.request?.url || 'http://0.0.0.0').pathname;
  basicInfo.originAddress = new URL(data[0]?.documentURL || 'http://0.0.0.0').host;
  basicInfo.requestMethod = data[0]?.request?.method;
  basicInfo.type = data[0].type;
  basicInfo.timestamp = data[0].timestamp;
  if (data.length > 2) {
    basicInfo.status = data[2].response?.status;
    basicInfo.statusText = data[2].response?.statusText;
  }
  if(data.length > 3) {
    basicInfo.duration = formatDuration(data[0].timestamp, data[3].timestamp);
  }
  return basicInfo;
}
function getRequestHeaders(data) {
  let requestHeaders = undefined
  data?.forEach(item => {
    if (item.method === 'Network.requestWillBeSent') {
      requestHeaders = item.request?.headers || '{}'
    }
  })
  return requestHeaders
}
function getResponseHeaders(data) {
  if (!data || data.length < 3) return {}
  return data[2].response?.headers
}
function getRequestParams(data) {
  let requestBody = undefined
  data?.forEach(item => {
    if (item.method === 'Network.requestWillBeSent') {
      try {
        requestBody = JSON.parse(item.request?.postData || "{}");
      } catch (error) {
        requestBody = item.request?.postData;
      }
    }
  })
  return requestBody
}
function getResponseBody(data) {
  let responseBody = undefined
  data?.forEach(item => {
    if (item.method === 'Network.responseBody') {
      responseBody = formatResponseBody(data[0].type, item.body);
    }
  })
  return responseBody
}

export const TYPE_NOT_JSON = ['Script', 'Stylesheet', 'Document'];
function formatResponseBody(type, body){
  if(TYPE_NOT_JSON.includes(type)) {
    return body
  }
  try {
    // 为了过滤，这里直接返回原数据
    return body.replace(/\s+/g, '');
    // return JSON.parse(body);
  } catch (error) {
    return body;
  }
}
//#endregion
