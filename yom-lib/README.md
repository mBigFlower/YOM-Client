# Yesterday Once More 

a lib, store console and network to indexdb

> It rewrites the browser's console and network

## Usage

`npm i yom --registry http://192.168.240.32:9999/`

### 1. for index.html

``` html
<body>
  <script type="module" src="/yom-lib/dist/yom.mjs"></script>
</body>
```

### 2. import

``` js
import yom from 'yom'
```

## Configration

``` js
import yom from 'yom'
yom.setConfig({
  "logRorate": 3,
  "yomNetworkEnable": "1",
  "yomConsoleEnable": "1",
  "chromeConsoleEnable": "1",
  "workerBaseUrl": "",
  "dbName": "mcc",
  "networkFilter": [{ url: 'location.pathname', filter: 2 }]
})
```

|key|description|default|
|---|---|---|
|logRorate|log rotate hours|3|
|yomNetworkEnable|enable store network log; "1":enable, others means disable|"1"|
|yomConsoleEnable|enable store console log; "1":enable, others means disable|"1"|
|chromeConsoleEnable|enable chrome console log; "1":enable, others means disable|"1"|
|workerBaseUrl|base url for worker|""|
|dbName|database name|location.pathname|
|networkFilter|如果不希望 **network** 库中存太多内容，可用此过滤|[{url, isFullPath, filter}]|


### networkFilter详细说明
数组中的 item 目前有两个字段

- url： 请求的 pathname（请求的 origin 我会根据当前页面自动获取）
- isFullPath: 请求的 url 是否是全路径（如果是 true，则yom不会自动拼接url）
- filter： 过滤的类型（需要过滤哪些内容）

**url**

举个例子：

`https://10.115.24.110:26000/icc-incident-service/icc/server/get_alarm_state_statistics_request`

这么一个请求，传给我

`/icc-incident-service/icc/server/get_alarm_state_statistics_request`

(`https://10.115.24.110:26000` 我从当前页面里能取到)

**isFullPath**

当出现不需要 yom 拼接地址时，可在 url 传入全路径，并将 isFullPath 设置为 true

`isFullPath: true`

**filter**

|FilterType|含义|
|---|---|
|0|整个请求 所有都不保存|
|1|请求体不保存|
|2|响应体不保存|
|3|请求体 和 响应体 不保存；请求地址、Header等仍然保存|
