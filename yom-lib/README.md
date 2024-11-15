# Yesterday Once More 

a lib, store console and network to indexdb

> It rewrites the browser's console and network

## Usage

`yarn add yom --registry http://192.168.240.32:9999/`

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
  "workerBaseUrl": ""
})
```

|key|description|default|
|---|---|---|
|logRorate|log rotate hours|3|
|yomNetworkEnable|enable store network log; "1":enable, others means disable|"1"|
|yomConsoleEnable|enable store console log; "1":enable, others means disable|"1"|
|chromeConsoleEnable|enable chrome console log; "1":enable, others means disable|"1"|
|workerBaseUrl|base url for worker|""|

