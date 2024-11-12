

import { clearDataRegularly, getConsole, getNetworks, downloadData } from './datacenter';
import { startRecordClick, downloadRecord } from './record/recorderImpl.js';
import { webrtc } from './record/lib.webrtc.js';
import { addOverlay } from './export-panel';
import './record/EBML-vite.umd.js'
import Network from './network';
import Console from './console';
import * as config from './config';
import { isSelf } from './common/utils.js'

/**
 * 快捷键唤醒日志导出面板
 * Ctrl + Alt + 6
 */
if (!isSelf())
  window.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.altKey && event.key === '6') {
      addOverlay();
    }
  });
/**
 * 初始化，重写 console 和 network
 */
function registerProtocol() {
  new Network();
  new Console();
}
/**
 * 导出控制台数据
 * @param {number} startTime - 开始时间
 * @param {number} endTime - 结束时间
 * @returns {Promise<unknown>} 一个 Promise，包含着调用 getConsole 方法返回的结果
 */
async function getConsoleList(startTime, endTime) {
  return await getConsole(startTime, endTime);
}
/**
 * 导出网络数据
 * @param {number} startTime - 开始时间
 * @param {number} endTime - 结束时间
 * @returns {Promise<unknown>} 一个 Promise，包含着调用 getNetworks 方法返回的结果
 */
async function getNetworkList(startTime, endTime) {
  return await getNetworks(startTime, endTime);
}

/**
 * 下载数据到本地
 * @param {*} data 待下载的数据
 * @param {*} type console 或 network
 */
async function downloadFile2Local(data, type) {
  await downloadData(data, type);
}

/**
 * 记录屏幕操作
 * 这个函数会使用 WebRTC API 来获取当前屏幕的视频流，并对其进行录制
 * 如果录制成功，会将视频保存到本地，并返回录制的开始和结束时间
 * 如果录制过程中出现错误，会将错误信息打印到控制台
 * @returns {Promise<{ startTime: number, endTime: number }>} 一个 Promise，包含着录制的开始和结束时间
 */
async function recordScreen() {
  const options = {
    audio: true,
    video: {
      displaySurface: "window"
    }
  };
  const screenStream = await webrtc.getScreen(options);
  const res = await startRecordClick(screenStream)
  const { startTime, endTime } = res;
  console.log('startRecordClick then', startTime, endTime);
  await downloadRecord(startTime, endTime);
  return res;
}

registerProtocol();

// 程序启动后，自动清理日志一次
setTimeout(() => {
  clearDataRegularly();
}, 1000 * 60);


export default {
  registerProtocol,
  getConsoleList,
  getNetworkList,
  downloadFile2Local,
  recordScreen,
  ...config,
}