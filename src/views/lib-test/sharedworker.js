// import yom from 'yom'
import yom from '../../../yom-lib/dist/yom.mjs'
import musicResource from '../../../public/Yesterday Once More.mp3'
console.log('self yom', yom);
yom.setConfig({
  "logRorate": 3,
  "yomNetworkEnable": "1",
  "yomConsoleEnable": "1",
  "chromeConsoleEnable": "1",
  "workerBaseUrl": "http://10.110.13.31:5173/public/"
});
console.log('6666');
self.onconnect = function (event) {
  const port = event.ports[0];

  port.onmessage = function (event) {
    console.info('SharedWorker received:', event.data);
    // 处理接收到的消息并发送响应
    port.postMessage('Hello from SharedWorker!');
    let i = 0
    setInterval(() => {
      i++
      console.info('setInterval worker i', i)
      port.postMessage(i + ' from SharedWorker!');
    }, 1000);
  };

  setTimeout(() => {
    setXHRRequest()
    setXHRRequest2()
  }, 3000);
};

function setXHRRequest() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", (e) => {
    console.log('setXHRRequest', e);
  });
  oReq.open("GET", "https://10.115.24.110:26000/commandcenter/mrps/pucmaster/sr/mrps/homeVideo/getCallInfo?start_time=1731462249&end_time=1731465745&numbers=103100");
  // oReq.open("GET", 'Yesterday Once More.mp3')
  oReq.send();
}
function setXHRRequest2() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", (e) => {
    console.log('setXHRRequest', e);
  });
  // oReq.open("GET", 'language/en-US.json')
  // oReq.open("GET", 'http://10.110.13.31:5173/public/Yesterday Once More.mp3')
  oReq.open("GET", 'Yesterday Once More.mp3')
  oReq.send();
}
