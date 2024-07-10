import { exportConsoleData, exportNetworkData } from "./datacenter.js";
import { webrtc } from './record/lib.webrtc.js';
import { startRecordClick, downloadRecord } from './record/recorderImpl.js';
import { formatLocalDate } from './common/utils.js'

export const ID_OVERLAY = 'YomOverlay';

export function addOverlay() {
  // 创建一个 div 元素
  var overlay = document.createElement('div');
  overlay.id = ID_OVERLAY;

  // 设置 div 的样式
  overlay.style.position = 'absolute';
  overlay.style.right = '50px';
  overlay.style.bottom = '100px';
  overlay.style.zIndex = '9999'; // 设置 z-index 以确保 div 位于最顶层
  overlay.style.border = 'solid 2px black';
  overlay.style.backgroundColor = 'white'; // 设置背景颜色和透明度
  overlay.style.WebkitAppearance = 'auto';

  // 将创建的 div 添加到 body 中
  document.body.appendChild(overlay);

  const mainDiv = addOperationLayout();
  overlay.appendChild(mainDiv);
}

function addOperationLayout() {
  // 创建 div
  let layoutDiv = document.createElement('div');
  layoutDiv.id = 'myDiv';
  layoutDiv.style.display = 'flex';
  layoutDiv.style.flexDirection = 'column';
  layoutDiv.style.justifyContent = 'start';
  layoutDiv.style.alignItems = 'start';
  layoutDiv.style.padding = '20px';

  // 时间选择器
  const startTimeInput = document.createElement('input');
  startTimeInput.type = 'datetime-local';
  const endTimeInput = document.createElement('input');
  endTimeInput.type = 'datetime-local';
  // 设置默认时间
  const date = new Date();
  endTimeInput.value = formatLocalDate(date)
  date.setHours(date.getHours() - 1)
  startTimeInput.value = formatLocalDate(date)
  console.info('TimeInput ready', formatLocalDate(date))
  console.info('TimeInput', startTimeInput.value, endTimeInput.value)
  layoutDiv.appendChild(startTimeInput);
  layoutDiv.appendChild(endTimeInput);

  // 导出日志 button
  let consoleBtn = document.createElement('button');
  consoleBtn.textContent = 'Export Console';
  consoleBtn.style.margin = '12px 0 0 0';
  consoleBtn.style.padding = '0 12px';
  consoleBtn.style.WebkitAppearance = 'auto';
  consoleBtn.onclick = function () {
    consoleBtn.disabled = true;
    consoleBtn.textContent = 'Console downloading...';
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    exportConsoleData(startTime, endTime).then(() => {
      consoleBtn.disabled = false;
      consoleBtn.textContent = 'Export Console';
    });
  };
  layoutDiv.appendChild(consoleBtn);

  // 导出网络 button
  let networkBtn = document.createElement('button');
  networkBtn.textContent = 'Export Network';
  networkBtn.style.margin = '12px 0 0 0';
  networkBtn.style.padding = '0 12px';
  networkBtn.style.WebkitAppearance = 'auto';
  networkBtn.onclick = function () {
    networkBtn.disabled = true;
    networkBtn.textContent = 'Network downloading...';
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    exportNetworkData(startTime, endTime).then(() => {
      networkBtn.disabled = false;
      networkBtn.textContent = 'Export Network';
    });
  };
  layoutDiv.appendChild(networkBtn);


  //录音 button
  let recordBtn = document.createElement('button');
  recordBtn.textContent = 'Record';
  recordBtn.style.margin = '12px 0 0 0';
  recordBtn.style.padding = '0 12px';
  recordBtn.style.WebkitAppearance = 'auto';
  recordBtn.onclick = async () => {
    const options = {
      audio: true,
      video: {
        displaySurface: "window"
      }
    };
    const screenStream = await webrtc.getScreen(options);
    // 开始录音后，关闭悬浮窗
    removeDivById(ID_OVERLAY);
    startRecordClick(screenStream).then(async (res) => {
      const { startTime, endTime } = res;
      console.log('startRecordClick then', startTime, endTime);
      await downloadRecord(startTime, endTime);
      // 下载对应的数据
      await exportConsoleData(startTime, endTime);
      await exportNetworkData(startTime, endTime);
    });
  };
  layoutDiv.appendChild(recordBtn);


  // 创建关闭按钮
  let closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.margin = '12px 0 0 0';
  closeButton.style.padding = '0 12px';
  closeButton.style.WebkitAppearance = 'auto';
  closeButton.onclick = function () {
    removeDivById(ID_OVERLAY);
  };
  layoutDiv.appendChild(closeButton);

  return layoutDiv;
}

export function removeDivById(id) {
  var div = document.getElementById(id);
  console.log('removeDivById', div)
  if (div) {
    div.remove();
  }
}

async function exportClick(startTime, endTime) {
  let consoleCB = document.getElementById('consoleCB');
  if (consoleCB.checked)
    await exportConsoleData(startTime, endTime);
  let networkCB = document.getElementById('networkCB');
  if (networkCB.checked)
    await exportNetworkData(startTime, endTime);
}

