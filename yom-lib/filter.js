//#region Network 过滤
export const FilterType = {
  /** 整个请求 所有都不保存 */
  //   None: 0, // 有点麻烦，暂时不支持
  /** 请求体不保存 */
  NoRequestBody: 1,
  /** 响应体不保存 */
  NoResponseBody: 2,
  /** 请求体 和 响应体 不保存 */
  NoAllBody: 3,
};
export const networkFilterMap = new Map();
export function initNetworkFilter(workerBaseUrl, filterList) {
  const origin = workerBaseUrl || self.location.origin;
  filterList.forEach((item) => {
    if (networkFilterMap.has(item.url)) return;
    networkFilterMap.set(origin + item.url, item.filter);
  });
  console.log("networkFilterMap", networkFilterMap);
}

export function isNeedFilter(url, filterType) {
  const type = networkFilterMap.get(url);
  console.log("isNeedFilter", url, type, filterType);
  //   if (type === FilterType.None) return true;
  if (filterType === FilterType.NoRequestBody) return (type & 0x1) === 1;
  else if (filterType === FilterType.NoResponseBody) return (type & 0x02) === 2;
  else {
    console.warn("unknown filter type:", filterType);
    return false;
  }
}
//#endregion
