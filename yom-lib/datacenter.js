import Dexie from 'dexie';
import version from './v.json'
import { makeString2NumberChar, isSelf } from './common/utils'
import { configParams, LogLevel } from './config'

const ConsleTableName = 'consoles'
const NetworkTableName = 'networks'
const DBVersion = 2

/**
 * 添加一条console
 * @param {*} type 
 * @param {*} timestamp 
 * @param {*} data 
 * @returns 
 */
export function addConsole(type, timestamp, data) {
  if (configParams.logLevel === LogLevel.None) return;
  if (configParams.yomConsoleEnable !== "1") return;
  dbAddConsole({ timestamp, type, data });
}
/**
 * 获取时间段内的的console
 * @returns
 */
export async function getConsole(startTime, endTime) {
  return await dbGetConsole(startTime, endTime);
}

/**
 * 添加一条network
 * @param {*} data 
 * @returns 
 */
export function addNetwork(data) {
  if (configParams.yomNetworkEnable !== '1') return;
  // network 的时间戳是秒级别的，所以这里 *1000 转为毫秒
  const timestamp = data.params.timestamp * 1000 || Date.now();
  dbAddNetwork({ timestamp, data });
}
/**
 * 获取时间段内的的network
 * @returns
 */
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
    const hours = _hours || configParams.logRorate;
    console.info('clearDataRegularly', hours)
    // 获取 hours 小时之前的时间戳
    let hoursAgo = Date.now() - hours * 60 * 60 * 1000;

    db[ConsleTableName].where('timestamp').below(hoursAgo).delete()
      .then((res) => console.log(`Consoles older than ${hours} hours have been deleted.`, res))
      .catch(error => console.error('Failed to delete Consoles:', error));

    db[NetworkTableName].where('timestamp').below(hoursAgo).delete()
      .then((res) => console.log(`Networks older than ${hours} hours have been deleted.`, res))
      .catch(error => console.error('Failed to delete Networks:', error));
  } catch (error) {
    console.error('Failed to delete data regularly:', error);
  }
}

function clearDataByLines() {
  try {
    db[ConsleTableName].count().then(count => {
      if (count > 10) {
        db[ConsleTableName].limit(count - 10).delete()
          .then((res) => console.log(`Networks less ${count}`, res))
          .catch(error => console.error('Failed to delete Networks:', error));
      }
    });
    db[NetworkTableName].count().then(count => {
      if (count > 10) {
        db[NetworkTableName].limit(count - 10).delete()
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
  }, 1000 * 60 * 60)
}

//#region 数据库相关的基本语句


//#region 控制台日志
let consoleCount = 0;
function dbAddConsole(data) {
  consoleCount++;
  // 测试不够，先不发布此处
  // if (consoleCount > 0 && consoleCount % 100 === 0) {
  //   console.dir('[Console] write too fast !!!, queue count:' + consoleCount);
  //   const alarmData = {
  //     type: 'alarm',
  //     timestamp: Date.now(),
  //     data: {
  //       title: 'Console',
  //       content: `Write too fast!!!, queue count:${consoleCount}`,
  //     }
  //   }
  //   db[ConsleTableName].put(alarmData)
  // }
  return db[ConsleTableName].put(data).then(res => {
    consoleCount--;
    // if (consoleCount > 0 && consoleCount % 100 === 0) {
    //   console.dir('[Console] write over, queue count:' + consoleCount);
    //   const alarmData = {
    //     type: 'alarm',
    //     timestamp: Date.now(),
    //     data: {
    //       title: 'Console',
    //       content: `Write over, queue count:${consoleCount}`,
    //     }
    //   }
    //   db[ConsleTableName].put(alarmData)
    // }
  });
}
async function dbGetConsole(beginTime, endTime) {
  console.log('dbGetConsole', new Date(beginTime).getTime(), new Date(endTime).getTime());
  return await db[ConsleTableName].where('timestamp').between(new Date(beginTime).getTime(), new Date(endTime).getTime()).toArray();
}
/**
 * 获取数据库中控制台相关数据的数量
 * @returns
 */
export async function getConsoleCount() {
  return await db[ConsleTableName].count();
}
export async function dbBulkAddConsole(data) {
  return await db[ConsleTableName].bulkPut(data)
}
//#endregion

//#region 网络
let networkCount = 0;
function dbAddNetwork(data) {
  networkCount++;
  // if (networkCount % 100 === 0) {
  //   console.dir('[Network] Reduce the write frequency !!!, queue count:' + networkCount);
  // }
  return db[NetworkTableName].put(data).then(res => {
    networkCount--;
  });;
}
export async function dbBulkAddNetwork(data) {
  return await db[NetworkTableName].bulkPut(data)
}
async function dbGetNetwork(beginTime, endTime) {
  console.log('dbGetNetwork', new Date(beginTime).getTime(), new Date(endTime).getTime())
  return await db[NetworkTableName].where('timestamp').between(new Date(beginTime).getTime(), new Date(endTime).getTime()).toArray();
}
/**
 * 获取数据库中网络请求相关数据的数量
 * @returns
 */
export async function getNetworkCount() {
  return await db[NetworkTableName].count();
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
 * @param {*} data 待导出的数据
 * @param {*} type console 或 network
 */
async function exportData(data, type) {
  if (!data?.length) return alert('no data')
  if (data.length > 8888) return alert('too large, change time again plz')
  await downloadData(data, type);
}

export async function downloadData(data, type) {
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

let db;
let dbKey;
export function openNewDatabase(newKey) {
  // 导入 Dexie， 创建一个新的数据库实例
  const key = newKey || getDBKey();
  if(key === dbKey) return;
  closeCurrentDatabase();
  db = new Dexie('devtools' + key);
  // 定义表
  db.version(DBVersion).stores({
    [ConsleTableName]: '++id,timestamp,type,data',
    [NetworkTableName]: '++id,timestamp,data'
  });
}
function closeCurrentDatabase() {
  try {
    if (db) db.close()
  } catch (error) {
    // ??
  }
}

openNewDatabase();
startClearInterval();

/**
 * 为了区分不同网元，分别写入不同的数据库。
 * 根据 url 的 pathname
 */
function getDBKey() {
  try {
    console.log('getDBKey', configParams)
    if (configParams.dbName) return configParams.dbName;
    if (isSelf()) return makeString2NumberChar(self.location.pathname) || '';
    else return makeString2NumberChar(window.location.pathname) || '';
  } catch (err) {
    return '';
  }
}

console.log('%cYom-' + getDBKey() + '%c' + version?.version + '%c' + version?.buildTime,
  'color:white;background:#606060;padding:4px 12px;border-radius:3px 0px 0px 3px',
  'background:lightGreen;padding:4px 12px;',
  'color:white;background:#0074af;padding:4px 12px;border-radius:0px 3px 3px 0px')
