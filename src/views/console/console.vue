
<template>
  <div class="console-root">
    <div class="console-filter">
    </div>
    <!-- <a-list style="height: 300px;overflow-y: auto;">
      <a-list-item v-for="console in consolefiltered">
        <span class="date-time">{{ timestamp2dateTime(console.timestamp) }}</span>
        <JsonViewer v-for="item in getData(console.data)" :value="item"></JsonViewer>
      </a-list-item>
    </a-list> -->
    <div v-for="console in consolefiltered">
      <span class="date-time" :style="typeStyle(console.type)">{{ timestamp2dateTimeMs(console.timestamp) }}</span>
      <JsonViewer :show-array-index="false" v-for="item in getData(console.data)" :value="item || ''"></JsonViewer>
    </div>
    <a-empty class="console-empty" v-if="isEmpty">No Data</a-empty>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { timestamp2dateTimeMs } from '@/utils/date-utils'
import JsonViewer from '@/components/json-viewer.vue'
import { useConsoleStore } from '@/store/console'
import { useRouter } from "vue-router";
import moment from 'moment';
const router = useRouter();
const consoleStore = useConsoleStore();
console.log('console', consoleStore.consoles);

const props = defineProps({
  startTime: {
    required: false,
  },
  endTime: {
    required: false,
  },
});

//#region 数据过滤
const consolefiltered = computed(() => {
  console.log('consolefiltered prop.start and end time', props.startTime, props.endTime);
  const startTimestamp = moment(props.startTime || '1997-01-01 00:00:00').valueOf();
  const endTimestamp = moment(props.endTime || '2080-01-01 00:00:00').valueOf();
  console.log('consolefiltered real start and end time', startTimestamp, endTimestamp);
  console.log('consolefiltered consoleStore.consoles', consoleStore.consoles.value, consoleStore.consoles[0]);
  return consoleStore.consoles.filter((console) => {
    return console.timestamp >= startTimestamp && console.timestamp <= endTimestamp;
  });
});

//#endregion

function getData(data) {
  if (!data) return data;
  if (Array.isArray(data)) return data;
  return [data];
}

function typeStyle(type) {
  switch (type) {
    case 'error':
      return 'color: red;';
    case 'warn':
      return 'color: yellow;';
    case 'info':
      return 'color: green;';
    default:
      return '';
  }
}

const isEmpty = computed(() => {
  return consoleStore.consoles.length === 0;
});
</script>
<style scoped lang="less">
@import url('./console.less');
</style>