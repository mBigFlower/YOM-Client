import yom from '../../../yom-lib/dist/yom.mjs'
console.log('self yom', yom);
yom.setConfig({
  "logRorate": 3,
  "yomNetworkEnable": "1",
  "yomConsoleEnable": "1",
  "chromeConsoleEnable": "0"
});
console.log('6666');
self.onconnect = function (event) {
  const port = event.ports[0];

  port.onmessage = function (event) {
    console.log('SharedWorker received:', event.data);
    // 处理接收到的消息并发送响应
    port.postMessage('Hello from SharedWorker!');
    let i = 0
    setInterval(() => {
      i++
      console.log('setInterval worker i', i)
      port.postMessage(i + ' from SharedWorker!');
    }, 1000);
  };
};
