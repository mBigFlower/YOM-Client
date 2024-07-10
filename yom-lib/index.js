

import { clearDataRegularly } from './datacenter';
import { addOverlay } from './export-panel';
import './record/EBML-import'
import Network from './network';
import Console from './console';

/**
 * 快捷键唤醒日志导出面板
 * Ctrl + Alt + 6
 */
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
registerProtocol();

// 定期清理日志
clearDataRegularly();
