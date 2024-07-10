import Dexie from 'dexie';
import version from './v.json'
import { makeString2NumberChar } from './common/utils'

export function addConsole(type, timestamp, data) {
  dbAddConsole({ timestamp, type, data });
}
export async function getConsole(startTime, endTime) {
  return await dbGetConsole(startTime, endTime);
}


export function addNetwork(data) {
  // network 的时间戳是秒级别的，所以这里 *1000 转为毫秒
  const timestamp = data.params.timestamp * 1000 || Date.now();
  dbAddNetwork({ timestamp, data });
}
export async function getNetworks(startTime, endTime) {
  return await dbGetNetwork(startTime, endTime);
}

/**
 * 定期清理数据库中的数据
 */
export function clearDataRegularly(_hours) {
  clearDataByTime(_hours);
  // clearDataByLines();
}

function clearDataByTime(_hours) {
  try {
    const hours = _hours || localStorage.getItem('yom-log-rotate') || 12;
    console.info('clearDataRegularly', hours)
    // 获取 hours 小时之前的时间戳
    let hoursAgo = Date.now() - hours * 60 * 60 * 1000;

    db.consoles.where('timestamp').below(hoursAgo).delete()
      .then((res) => console.log(`Consoles older than ${hours} hours have been deleted.`, res))
      .catch(error => console.error('Failed to delete Consoles:', error));

    db.networks.where('timestamp').below(hoursAgo).delete()
      .then((res) => console.log(`Networks older than ${hours} hours have been deleted.`, res))
      .catch(error => console.error('Failed to delete Networks:', error));
  } catch (error) {
    console.error('Failed to delete data regularly:', error);
  }
}

function clearDataByLines() {
  try {
    db.consoles.count().then(count => {
      if (count > 10) {
        db.consoles.limit(count - 10).delete()
          .then((res) => console.log(`Networks less ${count}`, res))
          .catch(error => console.error('Failed to delete Networks:', error));
      }
    });
    db.networks.count().then(count => {
      if (count > 10) {
        db.networks.limit(count - 10).delete()
          .then((res) => console.log(`Networks less ${count}`, res))
          .catch(error => console.error('Failed to delete Networks:', error));
      }
    });
  } catch (error) {
    console.error('Failed to delete data regularly:', error);
  }
}

/**
 * 开启定时清理数据库中的数据
 * （10分钟一次）
 */
export function startClearInterval() {
  setInterval(() => {
    console.log('startClearInterval');
    clearDataRegularly();
  }, 1000 * 60 * 20)
}

//#region 数据库相关的基本语句


//#region 控制台日志
function dbAddConsole(data) {
  return db.consoles.put(data);
}
async function dbGetConsole(beginTime, endTime) {
  console.log('dbGetConsole', new Date(beginTime).getTime(), new Date(endTime).getTime());
  return await db.consoles.where('timestamp').between(new Date(beginTime).getTime(), new Date(endTime).getTime()).toArray();
}
/**
 * 获取数据库中控制台相关数据的数量
 * @returns
 */
export async function getConsoleCount() {
  return await db.consoles.count();
}
//#endregion

//#region 网络
function dbAddNetwork(data) {
  return db.networks.put(data);
}
async function dbGetNetwork(beginTime, endTime) {
  console.log('dbGetNetwork', new Date(beginTime).getTime(), new Date(endTime).getTime())
  return await db.networks.where('timestamp').between(new Date(beginTime).getTime(), new Date(endTime).getTime()).toArray();
}
/**
 * 获取数据库中网络请求相关数据的数量
 * @returns
 */
export async function getNetworkCount() {
  return await db.networks.count();
}
//#endregion

//#endregion

//#region 导出数据到本地
export async function exportConsoleData(startTime, endTime) {
  console.info('exportConsoleData start');
  const data = await getConsole(startTime, endTime);
  await exportData(data, 'console');
  console.info('exportConsoleData over');
}

export async function exportNetworkData(startTime, endTime) {
  console.info('exportNetworkData start');
  const data = await getNetworks(startTime, endTime);
  await exportData(data, 'network');
  console.info('exportNetworkData over');
}

/**
 * 导出数据到本地
 * @param {*} data
 * @param {*} type
 */
async function exportData(data, type) {
  if (data.length > 8888) return alert('too large, change time again plz')
  await downloadData(data, type);
}

async function downloadData(data, type) {
  // 创建一个 ReadableStream
  let stream = new ReadableStream({
    start(controller) {
      // 将数组的每个元素转换为 JSON 字符串并添加到流中
      let start = new TextEncoder().encode('[');
      controller.enqueue(start);
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const endStr = index === data.length - 1 ? ']' : ',';
        let jsonString = JSON.stringify(element) + endStr;
        let uint8Array = new TextEncoder().encode(jsonString);
        controller.enqueue(uint8Array);
      }
      // 关闭流
      controller.close();
    }
  });

  // 创建一个 Response 对象
  let response = new Response(stream);
  // 创建一个 Blob 对象
  let blob = await response.blob();
  // 创建一个 URL 对象
  let url = URL.createObjectURL(blob);

  // 创建一个 a 标签
  let a = document.createElement('a');
  a.href = url;
  a.download = `${type}-${Date.now()}.json`;
  // 触发下载
  a.click();
  // 释放 URL 对象
  URL.revokeObjectURL(url);
}
//#endregion

// 导入 Dexie， 创建一个新的数据库实例
const key = getDBKey();
const db = new Dexie('devtools' + key);
// 定义表
db.version(1).stores({
  consoles: '++id,timestamp,type,data',
  networks: '++id,timestamp,data'
});
startClearInterval();

/**
 * 为了区分不同网元，分别写入不同的数据库。
 * 根据 url 的 pathname
 */
function getDBKey() {
  try {
    const key = makeString2NumberChar(window.location.pathname);
    if (window) return key || '';
    if (self) return key || '';
  } catch (err) {
    return '';
  }
}

console.log('%cYom-' + getDBKey() + '%c' + version?.version + '%c' + version?.buildTime,
  'color:white;background:#606060;padding:4px 12px;border-radius:3px 0px 0px 3px',
  'background:lightGreen;padding:4px 12px;',
  'color:white;background:#0074af;padding:4px 12px;border-radius:0px 3px 3px 0px')
