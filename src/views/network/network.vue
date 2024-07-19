<template>
  <div class="network-root">
    <NetworkFilter :statusOptions="statusFilterOptions" @on-input-changed="onInputChanged"
      @on-status-changed="onStatusChanged"></NetworkFilter>
    <div class="network-main">
      <div class="network-table-wrap" :style="tableWrapStyle">
        <a-table class="network-table" column-resizable :bordered="{ cell: true }" :columns="columns" :stripe="true"
          :data="networkFiltered" :pagination="paginationProps" @column-resize="handleResize"
          @cell-click="handleCellClick" :scrollbar="false" @page-change="onPageChanged"
          :row-class="record => getRowClass(record)" @page-size-change="onPageSizeChanged"
          :scroll="{ x: '100%', y: '100%' }">
          <template #empty>
            <a-empty>No Data</a-empty>
          </template>
          <template #requestPathName="{ record }">
            {{ record.basicInfo.requestPathName }}
          </template>
          <template #requestMethod="{ record }">
            <span>{{ record.basicInfo.requestMethod }}</span>
          </template>
          <template #status="{ record }">
            <a-tooltip :content="record.basicInfo.statusText">
              <span>{{ record.basicInfo.status }}</span>
            </a-tooltip>
          </template>
          <template #type="{ record }">
            <span>{{ record.basicInfo.type }}</span>
          </template>
          <template #duration="{ record }">
            <span>{{ record.basicInfo.duration }}</span>
          </template>
          <template #timestamp="{ record }">
            <span>{{ timestamp2dateTimeMs(record.basicInfo.timestamp) }}</span>
          </template>
        </a-table>
      </div>
      <NetworkDetail v-model:visible="detailVisible" :data="detailData">
      </NetworkDetail>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useNetworkStore } from '@/store/network'
import { timestamp2dateTimeMs } from '@/utils/date-utils';
import NetworkDetail from './network-detail.vue';
import NetworkFilter from './network-filter.vue';
import moment from 'moment';
const networkStore = useNetworkStore();
const columnWidth = ref(500); // 初始列宽度
const detailVisible = ref(false)
const detailData = ref(null)

const props = defineProps({
  startTimestamp: {
    required: false,
  },
  endTimestamp: {
    required: false,
  },
});

const paginationProps = reactive({
  pageSize: 16,
  current: 1,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
});

const columns = [
  {
    title: 'Name',
    slotName: 'requestPathName',
    width: columnWidth,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: 'Method',
    width: 100,
    slotName: 'requestMethod',
  },
  {
    title: 'Status',
    width: 100,
    slotName: 'status',
  },
  {
    title: 'Type',
    width: 110,
    slotName: 'type',
  },
  {
    title: 'Send Time',
    slotName: 'timestamp',
  },
  {
    title: 'Duration',
    slotName: 'duration',
  },
];

// #region 数据过滤
const filterParams = reactive({
  text: '',
  status: [],
})

const statusFilterOptions = computed(() => {
  const statusOptions = [];
  networkStore.shownNetworks.forEach((network) => {
    if (network.basicInfo.status === undefined) return;
    if (!statusOptions.includes(network.basicInfo.status)) {
      statusOptions.push(network.basicInfo.status)
    }
  });
  return statusOptions
});

const networkFiltered = computed(() => {
  console.log('networkFiltered', props.startTimestamp, props.endTimestamp);
  return networkStore.shownNetworks.filter((network) => {
    const isUrlMatch = network.basicInfo.requestUrl?.includes(filterParams.text);
    const isStatusMatch = checkStatusMatch(network.basicInfo.status);
    const isTimeMatch = checkTimeMatch(props.startTimestamp, props.endTimestamp, network.basicInfo.timestamp * 1000);
    return isUrlMatch && isStatusMatch && isTimeMatch
  });
});

function onInputChanged(val) {
  console.log('onInputChanged', val);
  filterParams.text = val;
}

function onStatusChanged(val) {
  console.log('onStatusChanged', val);
  filterParams.status = val;
}

function checkTimeMatch(startTimestamp, endTimestamp, timeStamp) {
  if (!startTimestamp && !endTimestamp) return true;
  return timeStamp >= startTimestamp && timeStamp <= endTimestamp;
}
function checkStatusMatch(status) {
  if (!filterParams.status?.length) return true;
  return filterParams.status.includes(status);
}
// #endregion

const tableWrapStyle = computed(() => {
  if (detailVisible.value)
    return {
      width: `${columnWidth.value + 1}px`,
      display: 'block',
    }
  const maxWidth = window.innerWidth - 201;
  console.log('tableWrapStyle maxWidth', maxWidth);
  return {
    maxWidth: `${maxWidth + 1}px`,
    minWidth: '1000px',
    display: 'flex',
  };
});

function handleResize(dataIndex, width) {
  if (dataIndex !== '__arco_data_index_0') return;
  columnWidth.value = width;
  console.log('handleResize columnWidth', columnWidth.value);
}
function handleCellClick(record, column) {
  if (column.dataIndex !== '__arco_data_index_0') return
  detailVisible.value = true
  detailData.value = record
  console.log('handleCellClick', record, column)
}
const getRowClass = (record) => {
  const rowClasses = [];
  if (record.key === detailData.value?.key) rowClasses.push('highlight-row')
  if (record.basicInfo?.status !== 200) rowClasses.push('error-row')
  console.log('record', record)
  return rowClasses
};

function onPageChanged(page) {
  paginationProps.current = page;
}
function onPageSizeChanged(pageSize) {
  paginationProps.pageSize = pageSize;
}
</script>
<style scoped lang="less">
@import url('./network.less');
</style>
<style lang="less">
.highlight-row {
  .arco-table-td:first-child {
    background-color: rgb(209, 227, 252) !important;
    font-weight: bold !important;
  }
}

.error-row {
  .arco-table-td:first-child {
    color: red !important;
  }
}
</style>
