<template>
  <div class="lib-test">
    <h1>Lib Test</h1>
    <div class="form-parent">
      <a-form class="form" layout="vertical" :model="form">
        <a-form-item field="consoleContent" label="Console Content">
          <a-input v-model="form.consoleContent" />
        </a-form-item>
        <a-form-item field="interval" label="Interval (ms)">
          <a-input-number v-model="form.interval" />
        </a-form-item>
        <a-form-item field="number" label="Number">
          <a-input-number v-model.number="form.consoleNumber" />
        </a-form-item>
      </a-form>
      <a-form class="form" layout="vertical" :model="form">
        <a-form-item field="networkContent1" label="Network Content 1">
          <a-input v-model="form.networkContent1" />
        </a-form-item>
        <a-form-item field="networkContent2" label="Network Content 2">
          <a-input v-model="form.networkContent2" />
        </a-form-item>
        <a-form-item field="networkContent3" label="Network Content 3">
          <a-input v-model="form.networkContent3" />
        </a-form-item>
        <a-form-item field="networkContent4" label="Network Content 4">
          <a-input v-model="form.networkContent4" />
        </a-form-item>
        <a-form-item field="networkContent5" label="Network Content 5">
          <a-input v-model="form.networkContent5" />
        </a-form-item>
        <a-form-item>
        </a-form-item>
      </a-form>
    </div>
    <a-space>
      <a-button type="primary" @click="onStartClick">Start</a-button>
      <a-button @click="onStopClick">Stop</a-button>
      <a-button @click="startWorker">Start Test Worker</a-button>
    </a-space>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Message } from '@arco-design/web-vue';
import Dexie from 'dexie'
import yom from '../../../yom-lib/dist/yom.mjs'
// console.log('6666');
console.log('yom', yom);
yom.setConfig({
  "logRorate": 3,
  "yomNetworkEnable": "1",
  "yomConsoleEnable": "1",
  "chromeConsoleEnable": "1",
  "workerBaseUrl": "",
  "networkFilter": [{ url: 'http://10.110.13.54:10086/', filter: 2 }]
})
yom.addCallback(function (data) {
  console.dir(data)
})

console.log('yom window', window.yom)

const form = reactive({
  consoleContent: '{"timestamp":1724609400123,"type":"log","data":["MQ:topic_device_state_sync",{"header":{"system_id":"ICC","subsystem_id":"ICC-CTIServer","msgid":"00355e22-78fc-42fa-942e-5d74dd0c0bdd","related_id":"","send_time":"2024-08-25 18:10:00","cmd":"device_state_sync","request":"topic_device_state_sync","request_type":"1","reponse":"","reponse_type":"","cmsproperty":""},"body":{"acd":"5201","device":"12208","device_type":"ipphone","call_direction":"in","callref_id":"20240825180955006604","related_callref_id":"","csta_callref_id":"6604","caller_id":"2615630939","called_id":"12208","original_caller_id":"2615630939","original_called_id":"1600","state":"hangupstate","time":"2024-08-25 18:10:00","dept_code":"CEO PRINCIPAL@100000000000","dept_name":"CEO PRINCIPAL","register":"","held_call_refid":"","active_call_refid":"","hangup_type":"release","only_update_status":""}}]}',
  consoleNumber: 10,
  interval: 30, // 单位：毫秒
  networkContent1: `{"timestamp":1725932727000,"data":{"method":"Network.requestWillBeSent","params":{"requestId":"i22bXhdvXrR57SX0gMuWpVvRwj7SQNOb","request":{"method":"POST","url":"https://20.180.80.110:26000/icc-cti-service/icc/cti/set_client_heartbeat_cti","requestId":"i22bXhdvXrR57SX0gMuWpVvRwj7SQNOb","headers":{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=utf-8","Authorization":"Bearer eyJhbGciOiJIUzUxMiJ9.eyJzeXN0ZW1Db2RlIjoiU1lTX0NPREVfU1NPIiwidXNlclR5cGUiOiJZSExYLVBUIiwiZXhwIjozMzAyNjUwNjkyLCJ0ZXJtaW5hbFRhZyI6IjEwLjExMC4xMy41NCIsInVzZXJuYW1lIjoiY2MifQ.Bu706_pNzWvM-FEcR3J6Ghz_GAPZIcp2Eh8UnAKvwXbVXjkHGToynz5V9eeoV5P079L33oXCZ4pYcx0dX_d6Dg","Content-Language":"es-AR","Accept-Language":"es-AR"},"postData":"{'header':{'seat_no':'','token':'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzeXN0ZW1Db2RlIjoiU1lTX0NPREVfU1NPIiwidXNlclR5cGUiOiJZSExYLVBUIiwiZXhwIjozMzAyNjUwNjkyLCJ0ZXJtaW5hbFRhZyI6IjEwLjExMC4xMy41NCIsInVzZXJuYW1lIjoiY2MifQ.Bu706_pNzWvM-FEcR3J6Ghz_GAPZIcp2Eh8UnAKvwXbVXjkHGToynz5V9eeoV5P079L33oXCZ4pYcx0dX_d6Dg','code':'cc','wguid':'1e01b95d-c101-9fef-5420-c14fac7e09ba'}}","hasPostData":true},"documentURL":"https://20.180.80.110:26000/command-center/icc","timestamp":1725936928.377,"wallTime":1725936928377,"type":"XHR"}}}`,
  networkContent2: `{"timestamp":1725932727000,"data":{"method":"Network.responseReceivedExtraInfo","params":{"requestId":"i22bXhdvXrR57SX0gMuWpVvRwj7SQNOb","headers":{"Access-Control-Allow-Credentials":" true","Access-Control-Allow-Headers":" *","Access-Control-Allow-Methods":" *","Access-Control-Allow-Origin":" *","Cache-Control":" no-cache, no-store, max-age=0, must-revalidate","Connection":" keep-alive","Content-Length":" 176","Content-Type":" text/html","Date":" Tue, 10 Sep 2024 02","Expires":" 0","Pragma":" no-cache","Referrer-Policy":" no-referrer","Server":" nginx/1.20.2","X-Content-Type-Options":" nosniff","X-Frame-Options":" DENY","X-Xss-Protection":" 1 ; mode=block"},"blockedCookies":[],"headersText":"access-control-allow-credentials: trueaccess-control-allow-headers: *access-control-allow-methods: *access-control-allow-origin: *cache-control: no-cache, no-store, max-age=0, must-revalidateconnection: keep-alivecontent-length: 176content-type: text/htmldate: Tue, 10 Sep 2024 02:59:26 GMTexpires: 0pragma: no-cachereferrer-policy: no-referrerserver: nginx/1.20.2x-content-type-options: nosniffx-frame-options: DENYx-xss-protection: 1 ; mode=block"}}}`,
  networkContent3: `{"timestamp":1725932727000,"data":{"method":"Network.responseReceived","params":{"type":"XHR","requestId":"i22bXhdvXrR57SX0gMuWpVvRwj7SQNOb","timestamp":1725936928.412,"response":{"url":"https://20.180.80.110:26000/icc-cti-service/icc/cti/set_client_heartbeat_cti","status":200,"statusText":"OK","headers":{"Access-Control-Allow-Credentials":" true","Access-Control-Allow-Headers":" *","Access-Control-Allow-Methods":" *","Access-Control-Allow-Origin":" *","Cache-Control":" no-cache, no-store, max-age=0, must-revalidate","Connection":" keep-alive","Content-Length":" 176","Content-Type":" text/html","Date":" Tue, 10 Sep 2024 02","Expires":" 0","Pragma":" no-cache","Referrer-Policy":" no-referrer","Server":" nginx/1.20.2","X-Content-Type-Options":" nosniff","X-Frame-Options":" DENY","X-Xss-Protection":" 1 ; mode=block"}}}}}`,
  networkContent4: `{"timestamp":1725932727000,"data":{"method":"Network.responseBody","params":{"requestId":"i22bXhdvXrR57SX0gMuWpVvRwj7SQNOb","body":"{    'header': {        'msgid': '554300b3-4fda-47ef-b1af-c78d5eb6cd67',        'result': '0',        'msg': 'success'    },    'body': {        'interval': '30'    }}"}}}`,
  networkContent5: `{"timestamp":1725932727000,"data":{"method":"Network.loadingFinished","params":{"requestId":"i22bXhdvXrR57SX0gMuWpVvRwj7SQNOb","encodedDataLength":176,"timestamp":1725936928.412}}}`,
});
// const db = new Dexie('devtoolsLibTest');
const onStartClick = async () => {
  console.log(form);
  // // 定义表
  // db.version(10).stores({
  //   consoles: '++id,timestamp,type,data',
  //   networks: '++id,timestamp,data'
  // });
  // await mockInsertConsoles();
  // await mockInsertNetworks();
  // startConsoleInterval();
  startNetworkInterval();
};

async function mockInsertConsoles() {
  const mockData = []
  const obj = JSON.parse(form.consoleContent)
  for (let index = 0; index < form.consoleNumber; index++) {
    mockData.push(obj);
  }
  console.log('mockInsertConsoles mockData', mockData);
  try {
    const res = await window.yom.dbBulkAddConsole(mockData)
    console.log('dbBulkAddConsole res', res);
  } catch (error) {
    console.error('dbBulkAddConsole err', error)
  }
}

async function mockInsertNetworks() {
  const mockData = []
  if (!form.networkContent1 || !form.networkContent2 || !form.networkContent3 || !form.networkContent4 || !form.networkContent5) return Message.error('请输入完整的网络请求信息')
  const obj1 = form.networkContent1 ? JSON.parse(form.networkContent1) : null
  const obj2 = form.networkContent2 ? JSON.parse(form.networkContent2) : null
  const obj3 = form.networkContent3 ? JSON.parse(form.networkContent3) : null
  const obj4 = form.networkContent4 ? JSON.parse(form.networkContent4) : null
  const obj5 = form.networkContent5 ? JSON.parse(form.networkContent5) : null
  if (!obj1 || !obj2 || !obj3 || !obj4 || !obj5) return Message.error('请输入完整的网络请求信息');
  for (let index = 0; index < form.consoleNumber; index++) {
    mockData.push(obj1);
    mockData.push(obj2);
    mockData.push(obj3);
    mockData.push(obj4);
    mockData.push(obj5);
  }
  console.log('mockInsertNetworks mockData', mockData);
  try {
    const res = await window.yom.dbBulkAddNetwork(mockData)
    console.log('mockInsertNetworks res', res);
    alert('over ' + res)
  } catch (error) {
    console.error('mockInsertNetworks err', error)
  }
}

const onStopClick = () => {
  clearInterval(consoleInterval);
  consoleInterval = null
  // clearInterval(networkInterval);
  // networkInterval = null
};

//#region 控制台定时插入
let consoleInterval;
function startConsoleInterval() {
  clearInterval(consoleInterval);
  console.log('startConsoleInterval', form);
  if (!form.consoleContent || !form.interval) return;
  const obj = JSON.parse(form.consoleContent);
  consoleInterval = setInterval(() => {
    console.log('consoleInterval', obj);
    // db.consoles.put({
    //   timestamp: Date.now(),
    //   type: 'info',
    //   obj
    // });
    // addData({
    //   timestamp: Date.now(),
    //   type: 'info',
    //   obj
    // })
  }, form.interval);
}
//#endregion

//#region 网络请求定时插入
let networkInterval;
function startNetworkInterval() {
  clearInterval(networkInterval);
  console.log('startNetworkInterval', form);
  if (!form.networkContent1 || !form.networkContent2 || !form.networkContent3 || !form.networkContent4 || !form.interval) return;
  networkInterval = setInterval(() => {
    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     console.log(xhr.responseText);
    //   }
    // };
    // xhr.open("GET", "https://www.baidu.com", true);
    // xhr.send();

    fetch('http://10.110.13.54:10086/test', { method: 'POST',  }).then(res => {
      console.log('res', res);
    }).catch(err => console.error('err', err));
  }, 500);
}
//#endregion

//#region Indexdb
let db; // 声明全局变量db

// 打开数据库
// const openRequest = indexedDB.open("devtoolsLibTest", 11);

// openRequest.onupgradeneeded = function (event) {
//   console.log('onupgradeneeded', event);
//   db = event.target.result; // 将db赋值为全局变量

//   if (!db.objectStoreNames.contains("consoles")) {
//     let store = db.createObjectStore("consoles", {
//       keyPath: "id", autoIncrement: true
//     });
//     store.createIndex('timestamp', 'timestamp', { unique: false }); // 表示可以重复
//     store.createIndex('type', 'type', { unique: false }); // 表示可以重复
//     store.createIndex('data', 'data', { unique: false }); // 表示可以重复
//   }
// };

// openRequest.onsuccess = function (event) {
//   console.log("数据库打开成功");
//   db = event.target.result; // 将db赋值为全局变量
// };

// openRequest.onerror = function (event) {
//   console.error("打开数据库失败：", event.target.errorCode);
// };

// 添加数据到consoles表的函数
function addData(data) {
  const transaction = db.transaction(["consoles"], "readwrite");
  const objectStore = transaction.objectStore("consoles");
  objectStore.add(data);

  transaction.oncomplete = function () {
    console.log("数据插入成功");
    // transaction.commit();
  };
  transaction.onerror = function (event) {
    console.error("数据插入失败：", event.target.errorCode);
  };
}

//#endregion


// function startWorker() {
//   console.log('worker start');
//   const worker = new SharedWorker('./sharedworker.js');
//   worker.port.onmessage = (event) => {
//     console.log('worker.onmessage', event.data);
//   };
//   worker.port.start();
//   worker.port.postMessage({number : 10000})
// }

async function startWorker() {
  const worker = new SharedWorker(new URL('./sharedworker', import.meta.url), {
    type: 'module',
  });
  worker.port.onmessage = function (event) {
    console.log('Main thread received:', event.data);
  };

  worker.port.start(); // 开始通信
  worker.port.postMessage('Hello from Main Thread!'); // 发送消息给 SharedWorker


  // var oReq = new XMLHttpRequest();
  // oReq.addEventListener("load", (e) => {
  //   console.log('setXHRRequest', e);
  // });
  // // oReq.open("GET", 'language/en-US.json')
  // // oReq.open("GET", 'http://10.110.13.31:5173/public/Yesterday Once More.mp3')
  // oReq.open("GET", 'http://www.baud.com')
  // oReq.send();
}

</script>
<style scoped lang="less">
@import url('./lib-test.less');
</style>