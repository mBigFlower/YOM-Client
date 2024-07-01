<template>
  <div class="console-root">
    <ConsoleFilter @on-input-changed="onInputChanged" @on-level-changed="onLevelChanged"></ConsoleFilter>
    <div v-for="console in consolefiltered">
      <span class="date-time" :style="typeStyle(console.type)">{{ console.time }}</span>
      <JsonViewer :show-array-index="false" v-for="item in getData(console.data)" :value="item || ''"></JsonViewer>
    </div>
    <a-empty class="console-empty" v-if="isEmpty">No Data</a-empty>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import JsonViewer from '@/components/json-viewer.vue'
import { useConsoleStore } from '@/store/console'
import { useRouter } from "vue-router";
import moment from 'moment';
import ConsoleFilter from './console-filter.vue';
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
const filterParams = reactive({
  text: '',
  level: [],
})

function onInputChanged(val) {
  console.log('onInputChanged', val);
  filterParams.text = val;
}

function onLevelChanged(val) {
  console.log('onStatusChanged', val);
  filterParams.level = val;
}
const consolefiltered = computed(() => {
  console.log('consolefiltered prop.start and end time', props.startTime, props.endTime);
  const startTimestamp = moment(props.startTime || '1997-01-01 00:00:00').valueOf();
  const endTimestamp = moment(props.endTime || '2080-01-01 00:00:00').valueOf();
  console.log('consolefiltered real start and end time', startTimestamp, endTimestamp);
  console.log('consolefiltered consoleStore.consoles', consoleStore.consoles.value, consoleStore.consoles[0]);
  return consoleStore.consoles.filter((consoleItem) => {
    const isTextMatch = checkTextMatch(filterParams.text, consoleItem);
    const isLevelMatch = checkLevelMatch(consoleItem.type);
    const isTimeMatch = checkTimeMatch(startTimestamp, endTimestamp, consoleItem.timestamp);
    return isTextMatch && isLevelMatch && isTimeMatch
  });
});
function checkTextMatch(inputStr, consoleItem) {
  if(consoleItem?.dataStr?.includes(inputStr)) return true;
  if(consoleItem?.time?.includes(inputStr)) return true;
  return false;
}
function checkTimeMatch(startTimestamp, endTimestamp, timeStamp) {
  return timeStamp >= startTimestamp && timeStamp <= endTimestamp;
}
function checkLevelMatch(level) {

  if(filterParams.level.length === 0) return true;
  return filterParams.level.includes(level);
}
//#endregion

function getData(data) {
  if (!data) return data;
  if (Array.isArray(data)) return data;
  return [data];
}

function typeStyle(type) {
  console.log('typeStyle', type)
  switch (type) {
    case 'error':
      return 'color: red;';
    case 'warning':
      return 'color: orange;';
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