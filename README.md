# Yesterday Once More

## Description

- [yom-lib](./yom/README_DEV.md) store the logs(console and network) to IndexDB
- [src](./yom-client/README.md) logs viewer

### yom-lib

![saveLogs.png](./screenshots/saveLogs.png)

1. The `console` and `network` methods have been rewritten to store the data in IndexDB
2. Press `Ctrl + Alt + 6`, Wake up the export panel, which supports exporting within a specific time period logs (`console` or `network`)
3. Screen recording is supported

### yom-client

![showLogs.gif](./screenshots/showNetwork.gif)

1. Show `console` details
2. Show `network` details
3. Play the screen record

## Todo List

- [x] rewritten console.debug 
- [x] add the filter for Network and Console
- [x] Batch import of logs 
- [x] Add time zone configuration

## Special thanks

- DongLiang Fan's idea
- https://github.com/Nice-PLQ/devtools-remote-debugger : The original inspiration
- https://github.com/HuolalaTech/page-spy-web Referring to this article, I made an interface by myself


## Version Update

### v1.2.2

[2024-07-09 19:08]
- `fix` some labels to English 

### v1.2.1

[2024-07-02 09:38]
- `feat` add style for network's item selected

### v1.2.0

[2024-07-01 09:11]
- `feat` add the console panel's log level filter
- `fix` fix the bug that the warning level is not orange color

### v1.1.0

[2024-07-01 09:00]
- `feat` add the console panel's text filter
