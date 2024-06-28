const FORMAT = 'YYYY-MM-DD HH:mm:ss';
const FORMAT_MS = 'YYYY-MM-DD HH:mm:ss SSS';
import moment from 'moment'

let defaultTimeOffset = Number(localStorage.getItem('timeOffset')) || -3;
export function setTimeOffset(offset) {
  defaultTimeOffset = offset;
  localStorage.setItem('timeOffset', offset)
}

/**
 * 时间戳转换为日期时间
 * @param {毫秒的时间戳} timestamp 
 * @returns 
 */
export function timestamp2dateTime(timestamp, utcOffset = defaultTimeOffset) {
  if (timestamp > 10000000000)
    return moment(timestamp).utcOffset(utcOffset).format(FORMAT);
  else
    return moment(timestamp * 1000).utcOffset(utcOffset).format(FORMAT);
}
/**
 * 时间戳转换为日期时间 带毫秒
 * @param {毫秒的时间戳} timestamp 
 * @returns 
 */
export function timestamp2dateTimeMs(timestamp, utcOffset = defaultTimeOffset) {
  if (timestamp > 10000000000)
    return moment(timestamp).utcOffset(utcOffset).format(FORMAT_MS);
  else
    return moment(timestamp * 1000).utcOffset(utcOffset).format(FORMAT_MS);
}
/**
 * 通过时间范围，百分比，计算当前百分比的时间
 * @param {开始时间} startTime 
 * @param {结束时间} endTime 
 * @param {百分比 0～100} percent 
 * @returns 
 */
export function calcTimeFromRangePercent(startTime, endTime, percent) {
  const startTimestamp = moment(startTime).valueOf();
  const endTimestamp = moment(endTime).valueOf();
  const duration = endTimestamp - startTimestamp;
  const currentTimestamp = startTimestamp + duration * percent / 100;
  const result = timestamp2dateTime(currentTimestamp);
  return result;
}
/**
 * 返回两个时间戳的时间差
 * @param {时间戳1} timestamp1 
 * @param {时间戳2} timestamp2 
 * @returns 
 */
export function formatDuration(timestamp1, timestamp2) {
  const duration = timestamp2 - timestamp1;
  console.log('6666', duration)
  if(duration < 1) return (duration * 1000).toFixed(0) + ' ms';
  else return duration.toFixed(2) + ' s';
}