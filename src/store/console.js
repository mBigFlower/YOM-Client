import { defineStore } from 'pinia'
import { ref } from "vue";
import { readFile2Object } from '@/utils/file-utils'
import { timestamp2dateTime, timestamp2dateTimeMs } from '@/utils/date-utils'

export const useConsoleStore = defineStore("consoleStore", () => {
  // 用于读取的 File 数据
  const originConsoleFiles = ref([]);
  // 用于 Console 页面展示的数据
  const consoles = ref([]);

  async function build() {
    consoles.value = [];
    for (let index = 0; index < originConsoleFiles.value.length; index++) {
      const file = originConsoleFiles.value[index];
      const logData = await readFile2Object(file);
      consoles.value = consoles.value.concat(logData.flat());
    }
    console.log('build consoles', consoles.value);
    beautyConsole();
  }
  /** 添加索引，用于搜索 */
  function beautyConsole() {
    consoles.value.forEach(item => {
      item.dataStr = JSON.stringify(item.data);
      item.time = timestamp2dateTimeMs(item.timestamp)
    })
  }

  function addOriginConsoleFile(file) {
    if (!file) return;
    console.log('addOriginConsoleFile', file, file.name);
    const index = originConsoleFiles.value.findIndex(f => f.name === file.name);
    if (index < 0) {
      originConsoleFiles.value.push(file)
      originConsoleFiles.value.sort();
      return true;
    }
    return false;
  }
  function removeOriginConsoleFile(file) {
    if (!file) return;
    originConsoleFiles.value = originConsoleFiles.value.filter(f => f.name !== file.name);
  }

  function clear() {
    consoles.value = [];
    originConsoleFiles.value = [];
  }

  const getConsoleTimeRange = () => {
    try {
      if (consoles.value.length < 1) return [];
      const startTime = timestamp2dateTime(consoles.value[0].timestamp);
      if (consoles.value.length === 1) {
        return [startTime, startTime]
      }
      const endTime = timestamp2dateTime(consoles.value[consoles.value.length - 1].timestamp);
      return [startTime, endTime];
    } catch (error) {
      console.error(error, 'getConsoleTimeRange');
      return [];
    }
  }
  return {
    originConsoleFiles,
    consoles,
    build,
    addOriginConsoleFile,
    removeOriginConsoleFile,
    clear,
    getConsoleTimeRange
  };
})