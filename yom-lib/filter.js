//#region Network 过滤
export const FilterType = {
  /** 整个请求 所有都不保存 */
  None: 0,
  /** 请求体不保存 */
  NoRequestBody: 1,
  /** 响应体不保存 */
  NoResponseBody: 2,
  /** 请求体 和 响应体 不保存 */
  NoAllBody: 3,
};
export const networkFilterMap = new Map();
export function initNetworkFilter(filterList) {
  networkFilterMap.clear();
  filterList.forEach((item) => {
    const url = item.isFullPath ? item.url : self.location.origin + item.url;
    if (networkFilterMap.has(url)) return;
    networkFilterMap.set(url, item.filter);
  });
  console.log("networkFilterMap", networkFilterMap);
}
export function isUrlFiltered(url) {
  return networkFilterMap.get(url) === FilterType.None;
}
export function isReqBodyFiltered(url) {
  return networkFilterMap.get(url) === FilterType.NoRequestBody;
}
export function isResBodyFiltered(url) {
  return networkFilterMap.get(url) === FilterType.NoResponseBody;
}
//#endregion
