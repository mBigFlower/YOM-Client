<template>
  <div class="all-in-one-root">
    <a-split direction="vertical" default-size="0.4" class="split-level1" min="0.3" max="0.8">
      <template #first>
        <Network v-if="!mediaStore.mediaSrc" :start-timestamp="currentStartTimestamp" :end-timestamp="currentEndTimestamp" />
        <a-split v-else class="split-level2" default-size="0.3" min="0.3" max="0.8">
          <template #first><a-typography-paragraph>
              <Media @mediaInfoUpdate="onMediaInfoUpdate" />
            </a-typography-paragraph></template>
          <template #second><a-typography-paragraph>
            </a-typography-paragraph></template>
        </a-split>
      </template>
      <template #second>
        <a-typography-paragraph>
          <Console :start-timestamp="currentStartTimestamp" :end-timestamp="currentEndTimestamp" />
        </a-typography-paragraph>
      </template>
    </a-split>
    <div class="all-in-one-progress">
      <span>{{ timestamp2dateTime(baseStartTime) }}</span>
      <a-slider class="progress-slider" range v-model="progressRange" :format-tooltip="currentTime" />
      <span>{{ timestamp2dateTime(baseEndTime) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { timestamp2dateTime, calcTimeFromRangePercent } from '@/utils/date-utils'
import JsonViewer from '@/components/json-viewer.vue'
import { useConsoleStore } from '@/store/console'
import { useNetworkStore } from '@/store/network'
import { useMediaStore } from '@/store/media'
import { useRouter } from "vue-router";
import moment from 'moment';

import Console from '@/views/console/console.vue'
import Network from '@/views/network/network.vue'
import Media from '@/views/media/media.vue'

const router = useRouter();
const consoleStore = useConsoleStore();
const networkStore = useNetworkStore();
const mediaStore = useMediaStore();
console.log('console', consoleStore.consoles);

const progressRange = ref([0, 0])


const currentTime = (value = progressRange.value) => {
  return `${timestamp2dateTime(currentStartTimestamp.value)} ~ ${timestamp2dateTime(currentEndTimestamp.value)}`;
};
const currentStartTimestamp = computed(() => {
  console.log('currentStartTime', progressRange.value[0]);
  const res = calcTimeFromRangePercent(baseStartTime.value, baseEndTime.value, progressRange.value[0]);
  console.log('currentStartTime res', res);
  return res;
});
const currentEndTimestamp = computed(() => {
  console.log('currentEndTime', progressRange.value[0]);
  const res = calcTimeFromRangePercent(baseStartTime.value, baseEndTime.value, progressRange.value[1]);
  console.log('currentEndTime res', res);
  return res;
});


const baseStartTime = computed(() => {
  const [start] = mediaStore.getMediaTimeRange()
  if (start) return start;
  const [consoleStart] = consoleStore.getConsoleTimeRange()
  if (consoleStart) return consoleStart;
  const [networkStart] = networkStore.getNetworkTimeRange()
  return networkStart || '1997-01-01 00:00:00';
})

const baseEndTime = computed(() => {
  const [, end] = mediaStore.getMediaTimeRange()
  if (end) return end;
  const [, consoleEnd] = consoleStore.getConsoleTimeRange()
  if (consoleEnd) return consoleEnd;
  const [, networkEnd] = networkStore.getNetworkTimeRange()
  return networkEnd || '1997-01-01 00:00:00';
})

function onMediaInfoUpdate(percent) {
  console.log('onMediaInfoUpdate');
  progressRange.value[1] = percent;
}

</script>
<style scoped lang="less">
@import url('./all-in-one.less');
@import url('../console/console.less');
@import url('../network/network.less');
@import url('../media/media.less');
</style>