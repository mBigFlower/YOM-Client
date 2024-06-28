
<template>
  <div class="all-in-one-root">
    <a-split direction="vertical" default-size="0.4" class="split-level1" min="0.3" max="0.8">
      <template #first>
        <a-split class="split-level2" default-size="0.3" min="0.3" max="0.8">
          <template #first><a-typography-paragraph>
              <Media @mediaInfoUpdate="onMediaInfoUpdate" />
            </a-typography-paragraph></template>
          <template #second><a-typography-paragraph>
              <Network :start-time="currentStartTime" :end-time="currentEndTime" />
            </a-typography-paragraph></template>
        </a-split>
      </template>
      <template #second>
        <a-typography-paragraph>
          <Console :start-time="currentStartTime" :end-time="currentEndTime" />
        </a-typography-paragraph>
      </template>
    </a-split>
    <div class="all-in-one-progress">
      <span>{{ baseStartTime }}</span>
      <a-slider class="progress-slider" range v-model="progressRange" :format-tooltip="currentTime" />
      <span>{{ baseEndTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { timestamp2dateTime, calcTimeFromRangePercent } from '@/utils/date-utils'
import JsonViewer from '@/components/json-viewer.vue'
import { useConsoleStore } from '@/store/console'
import { useMediaStore } from '@/store/media'
import { useRouter } from "vue-router";
import moment from 'moment';

import Console from '@/views/console/console.vue'
import Network from '@/views/network/network.vue'
import Media from '@/views/media/media.vue'

const router = useRouter();
const consoleStore = useConsoleStore();
const mediaStore = useMediaStore();
console.log('console', consoleStore.consoles);

const progressRange = ref([0, 0])


const currentTime = (value = progressRange.value) => {
  return `${currentStartTime.value} ~ ${currentEndTime.value}`;
};
const currentStartTime = computed(() => {
  console.log('currentStartTime', progressRange.value[0]);
  const res = calcTimeFromRangePercent(baseStartTime.value, baseEndTime.value, progressRange.value[0]);
  console.log('currentStartTime res', res);
  return res;
});
const currentEndTime = computed(() => {
  console.log('currentEndTime', progressRange.value[0]);
  const res = calcTimeFromRangePercent(baseStartTime.value, baseEndTime.value, progressRange.value[1]);
  console.log('currentEndTime res', res);
  return res;
});


const baseStartTime = computed(() => {
  const [start] = mediaStore.getMediaTimeRange()
  if (start) return start;
  const [consoleStart] = consoleStore.getConsoleTimeRange()
  return consoleStart || '1997-01-01 00:00:00';
})

const baseEndTime = computed(() => {
  const [, end] = mediaStore.getMediaTimeRange()
  if (end) return end;
  const [, consoleEnd] = consoleStore.getConsoleTimeRange()
  return consoleEnd || '2080-01-01 00:00:00';
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